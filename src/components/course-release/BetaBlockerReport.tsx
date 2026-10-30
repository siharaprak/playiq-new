'use client';

import { useId, useRef, useState, type FormEvent } from 'react';
import { submitCourseBlocker, type CourseBlockerInput, type CourseBlockerResult } from '@/app/(dashboard)/student/course-blocker-actions';
import type { CourseShell } from '@/lib/course-release/learning-record';
import styles from './course-release.module.css';

export type BetaBlockerReportProps = {
  shell: CourseShell;
  moduleNumber: number;
  /** Caller-controlled synthetic QA only; no cookie/query/env switch can replace the real action. */
  submit?: (input: CourseBlockerInput) => Promise<CourseBlockerResult>;
};

function visibleContext(moduleNumber: number) {
  const ua = navigator.userAgent;
  // Coarse, visible context only: not the raw user-agent, IP, OS version, account or URL query.
  const browserMatch = ua.match(/(Edg|Firefox|Chrome)\/(\d+)/);
  const safari = ua.match(/Version\/(\d+).*Safari/);
  const browser = browserMatch ? `${browserMatch[1] === 'Edg' ? 'Edge' : browserMatch[1]} ${browserMatch[2]}`
    : safari ? `Safari ${safari[1]}` : 'Other browser (version unavailable)';
  const os = /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS/iPadOS'
    : /Windows/.test(ua) ? 'Windows' : /Macintosh|Mac OS/.test(ua) ? 'macOS/iPadOS' : /Linux/.test(ua) ? 'Linux' : 'Other OS';
  const width = Math.max(0, Math.min(20000, Math.round(window.innerWidth)));
  const height = Math.max(0, Math.min(20000, Math.round(window.innerHeight)));
  // Do not retain arbitrary query parameters or fragments from the browser URL.
  return { browser, device: `${os}; viewport ${width} × ${height}`,
    pagePath: window.location.pathname === '/student/course-beta'
      ? `/student/course-beta?module=${moduleNumber}` : window.location.pathname };
}

/** Place outside any completion/data-loading disabled fieldset, near the beta lesson header. */
export default function BetaBlockerReport({ shell, moduleNumber, submit = submitCourseBlocker }: BetaBlockerReportProps) {
  const prefix = useId();
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<CourseBlockerInput['severity']>('blocked');
  const [context, setContext] = useState({ browser: 'Not checked yet', device: 'Not checked yet', pagePath: '' });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [reportReference, setReportReference] = useState('');
  const frozenReport = useRef<CourseBlockerInput | null>(null);
  const inFlight = useRef(false);
  const ticketInput = useRef<HTMLInputElement>(null);

  if (shell !== 'beta') return null;

  function checkContext() {
    if (!frozenReport.current) setContext(visibleContext(moduleNumber));
  }

  async function report(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || ticketId) return;
    setError('');
    if (!frozenReport.current) {
      if (!globalThis.crypto?.randomUUID) {
        setError('A secure report reference could not be created. Keep your problem description and ask the beta team for help; nothing was submitted.');
        return;
      }
      const capture = visibleContext(moduleNumber);
      setContext(capture);
      const reportId = globalThis.crypto.randomUUID();
      frozenReport.current = { reportId, moduleNumber, message, severity, ...capture };
      setReportReference(reportId);
    }
    inFlight.current = true;
    setPending(true);
    try {
      const result = await submit(frozenReport.current);
      if (result.ok && result.status === 'confirmed' && result.ticketId === frozenReport.current.reportId) {
        setTicketId(result.ticketId);
      } else if (!result.ok) {
        setError(result.error);
        // Input validation ran before any write: safe to edit and create a new reference.
        if (result.reason === 'validation') { frozenReport.current = null; setReportReference(''); }
      }
      else setError('Report not confirmed. Keep this reference and retry; no confirmed ticket was returned.');
    } catch {
      setError('The connection ended before confirmation. Your text is still here. Retry the same report reference, or give that reference to the beta team to check.');
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  async function copyTicket() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(ticketId);
      setCopyStatus('Ticket ID copied.');
    } catch {
      ticketInput.current?.focus();
      ticketInput.current?.select();
      setCopyStatus('Ticket ID selected. Use Copy, Ctrl+C or ⌘C; on a phone, touch and hold to copy.');
    }
  }

  function anotherReport() {
    frozenReport.current = null;
    setTicketId(''); setReportReference(''); setMessage(''); setSeverity('blocked'); setError(''); setCopyStatus('');
    checkContext();
  }

  return (
    <details className={styles.panel} onToggle={event => { if (event.currentTarget.open) checkContext(); }}>
      <summary style={{ cursor: 'pointer', fontWeight: 700, minHeight: 44, lineHeight: 1.5 }}>
        Report a problem / I’m blocked
      </summary>
      <p>This beta technical report is available even if you cannot finish the lesson. It is separate from the end-of-module feedback survey.</p>
      <p className={styles.small}>Describe what you tried, what happened, and what you expected. Do not include passwords, account details, private learning answers, or other people’s information. No screenshot is captured or uploaded; you may mention that a safely cropped screenshot is available separately.</p>
      <form onSubmit={report} aria-label="Beta technical problem report">
        <fieldset className={styles.fieldset} disabled={pending || !!reportReference}>
          <legend>Report for {moduleNumber === 0 ? 'Module 00' : `Module ${moduleNumber}`}</legend>
          <label className={styles.field} htmlFor={`${prefix}-severity`}>How much is this stopping you?
            <select id={`${prefix}-severity`} name="severity" value={severity} onChange={event => setSeverity(event.target.value as CourseBlockerInput['severity'])}>
              <option value="blocked">I’m blocked — I cannot continue</option>
              <option value="problem">There’s a problem — I can continue</option>
            </select>
          </label>
          <label className={styles.field} htmlFor={`${prefix}-message`}>What went wrong?
            <textarea id={`${prefix}-message`} name="message" required minLength={10} maxLength={4000} rows={5} value={message}
              aria-describedby={`${prefix}-privacy`} onChange={event => setMessage(event.target.value)} />
          </label>
          <p id={`${prefix}-privacy`} className={styles.help}>10–4000 characters. Technical details only; this report is not added to your Tutor knowledge file.</p>
        </fieldset>
        <label className={styles.field} htmlFor={`${prefix}-browser`}>Browser (included with report)
          <input id={`${prefix}-browser`} name="browser" value={context.browser} readOnly style={{ width: '100%', minHeight: 44, padding: 10, color: '#183448', background: '#fff', border: '1px solid #87aabb', borderRadius: 7 }} />
        </label>
        <label className={styles.field} htmlFor={`${prefix}-device`}>Device / screen size (included with report)
          <input id={`${prefix}-device`} name="device" value={context.device} readOnly style={{ width: '100%', minHeight: 44, padding: 10, color: '#183448', background: '#fff', border: '1px solid #87aabb', borderRadius: 7 }} />
        </label>
        <p className={styles.small}>Course page: {context.pagePath || 'Checked when you open or submit this report.'}</p>
        {reportReference && !ticketId && <p className={styles.warning}>Report reference (not a confirmation): <span style={{ overflowWrap: 'anywhere' }}>{reportReference}</span>. Keep this page open. Retry sends the same report unchanged, so an uncertain connection does not create duplicate tickets.</p>}
        {error && <p className={styles.error} role="alert">{error}</p>}
        {!ticketId && <button className={styles.button} type="submit" disabled={pending} aria-busy={pending}>
          {pending ? 'Confirming report…' : reportReference ? 'Retry this same report' : 'Send technical report'}
        </button>}
      </form>
      {ticketId && <div className={styles.success} role="status" aria-live="polite">
        <p><strong>Report saved and confirmed.</strong> Keep the ticket ID below for the beta team. This confirms storage, not that someone has reviewed or fixed it.</p>
        <label className={styles.field} htmlFor={`${prefix}-ticket`}>Confirmed ticket ID
          <input id={`${prefix}-ticket`} name="ticketId" ref={ticketInput} value={ticketId} readOnly style={{ width: '100%', minHeight: 44, padding: 10, color: '#183448', background: '#fff', border: '1px solid #87aabb', borderRadius: 7 }} />
        </label>
        <div className={styles.buttonRow}>
          <button type="button" className={styles.secondaryButton} onClick={copyTicket}>Copy ticket ID</button>
          <button type="button" className={styles.secondaryButton} onClick={anotherReport}>Report another problem</button>
        </div>
        <p aria-live="polite">{copyStatus}</p>
      </div>}
    </details>
  );
}
