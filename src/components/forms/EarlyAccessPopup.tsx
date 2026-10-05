'use client';

import { useActionState, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { submitEarlyAccessLead } from '@/lib/early-access/actions';
import {
  EARLY_ACCESS_CONSENT_TEXT,
  EARLY_ACCESS_COPY as COPY,
  EARLY_ACCESS_POPUP_RULES as RULES,
  EARLY_ACCESS_STORAGE_KEYS as KEYS,
  type EarlyAccessState,
  type EarlyAccessTrigger,
} from '@/lib/early-access/constants';

const initialState: EarlyAccessState = { status: 'idle', message: '' };

type GtagWindow = Window & { gtag?: (...args: unknown[]) => void };
function track(event: string, params: Record<string, unknown> = {}) {
  try {
    (window as GtagWindow).gtag?.('event', event, params);
  } catch {
    /* analytics must never break the popup */
  }
}

function isExcluded(pathname: string) {
  return RULES.excludedPrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function isSuppressed(): boolean {
  try {
    if (localStorage.getItem(KEYS.suppressed)) return true;
    if (sessionStorage.getItem(KEYS.shownThisSession)) return true;
  } catch {
    /* storage unavailable (private mode) — fall through and allow */
  }
  return false;
}

function suppressPermanently() {
  try {
    localStorage.setItem(KEYS.suppressed, new Date().toISOString());
  } catch {}
}

export function EarlyAccessPopup() {
  const pathname = usePathname() || '/';
  const [open, setOpen] = useState(false);
  const [trigger, setTrigger] = useState<EarlyAccessTrigger | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [state, formAction, pending] = useActionState(submitEarlyAccessLead, initialState);
  const emailRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const armedRef = useRef(false);
  const submitTrackedRef = useRef(false);

  // Suppress permanently after a completed application (/signup?beta=success)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (new URLSearchParams(window.location.search).get('beta') === 'success') {
      suppressPermanently();
    }
  }, [pathname]);

  // Arm the triggers (timer / scroll / exit intent) on eligible pages
  useEffect(() => {
    // Testing override: add ?ea_preview=1 to any URL to open immediately,
    // ignoring login state, dismissals and the timer/scroll triggers.
    if (!open && !armedRef.current && new URLSearchParams(window.location.search).has('ea_preview')) {
      armedRef.current = true;
      setIsMobile(window.matchMedia('(max-width: 639px), (pointer: coarse)').matches);
      setTrigger('timer');
      setOpen(true);
      return;
    }

    if (open || isExcluded(pathname) || isSuppressed()) return;

    let cancelled = false;
    const cleanups: Array<() => void> = [];

    const show = (t: EarlyAccessTrigger) => {
      if (cancelled || armedRef.current) return;
      if (isExcluded(window.location.pathname) || isSuppressed()) return;
      armedRef.current = true;
      try {
        sessionStorage.setItem(KEYS.shownThisSession, '1');
      } catch {}
      setTrigger(t);
      setOpen(true);
      track('early_access_popup_view', { trigger: t, page_path: window.location.pathname });
      cleanups.forEach((fn) => fn());
    };

    // Don't show to signed-in users (local session check, no network call)
    createClient()
      .auth.getSession()
      .then(({ data }) => {
        if (cancelled || data.session) return;

        const mobile = window.matchMedia('(max-width: 639px), (pointer: coarse)').matches;
        setIsMobile(mobile);

        // 1. ~20 seconds on page
        const timer = window.setTimeout(() => show('timer'), RULES.delayMs);
        cleanups.push(() => window.clearTimeout(timer));

        // 2. 40–50% scroll depth
        const onScroll = () => {
          const doc = document.documentElement;
          const scrollable = doc.scrollHeight - window.innerHeight;
          if (scrollable > 0 && window.scrollY / scrollable >= RULES.scrollThreshold) show('scroll');
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        cleanups.push(() => window.removeEventListener('scroll', onScroll));

        // 3. Exit intent (desktop only)
        if (!mobile) {
          const onMouseOut = (e: MouseEvent) => {
            if (!e.relatedTarget && e.clientY <= 0) show('exit_intent');
          };
          document.addEventListener('mouseout', onMouseOut);
          cleanups.push(() => document.removeEventListener('mouseout', onMouseOut));
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
    };
  }, [pathname, open]);

  // Close if the visitor navigates to an excluded page while it's open
  useEffect(() => {
    if (open && isExcluded(pathname)) setOpen(false);
  }, [pathname, open]);

  // Successful signup → suppress forever
  useEffect(() => {
    if (state.status === 'success' && !submitTrackedRef.current) {
      submitTrackedRef.current = true;
      suppressPermanently();
      track('early_access_popup_submit', { trigger, page_path: pathname });
    }
  }, [state.status, trigger, pathname]);

  const close = useCallback(() => {
    setOpen(false);
    if (state.status !== 'success') {
      track('early_access_popup_dismiss', { trigger, page_path: pathname });
    }
  }, [state.status, trigger, pathname]);

  // Focus management + Escape to close + simple focus trap
  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => emailRef.current?.focus({ preventScroll: true }), 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([type="hidden"]):not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);

    // Lock background scroll for the desktop modal only (bottom sheet stays non-blocking)
    const prevOverflow = document.body.style.overflow;
    if (!isMobile) document.body.style.overflow = 'hidden';

    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.({ preventScroll: true });
    };
  }, [open, isMobile, close]);

  if (!open) return null;

  const success = state.status === 'success';

  return (
    <div className={`fixed inset-0 z-[100] flex ${isMobile ? 'items-end' : 'items-center justify-center p-4'}`}>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close Early Access popup"
        tabIndex={-1}
        onClick={close}
        className={`absolute inset-0 cursor-default ${isMobile ? 'bg-black/50' : 'bg-[#020617]/80 backdrop-blur-sm'} animate-[ea-fade_0.25s_ease-out]`}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ea-popup-heading"
        aria-describedby="ea-popup-body"
        id="early-access-popup"
        className={[
          'relative w-full overflow-hidden border border-[#00c8ff]/40 bg-[#0b1120] text-left shadow-[0_0_60px_rgba(0,200,255,0.18)]',
          isMobile
            ? 'max-h-[88vh] overflow-y-auto rounded-t-2xl border-b-0 animate-[ea-sheet_0.35s_cubic-bezier(0.22,1,0.36,1)]'
            : 'max-w-[560px] rounded-2xl animate-[ea-pop_0.3s_cubic-bezier(0.22,1,0.36,1)]',
        ].join(' ')}
      >
        {/* Glow accents */}
        <div className="pointer-events-none absolute -top-24 -left-20 h-56 w-56 rounded-full bg-[rgba(0,200,255,0.14)] blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-56 w-56 rounded-full bg-[rgba(123,79,206,0.16)] blur-[80px]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#00c8ff] to-transparent" />

        {isMobile && <div className="relative mx-auto mt-2.5 h-1 w-10 rounded-full bg-slate-600" aria-hidden="true" />}

        <button
          type="button"
          onClick={close}
          aria-label="Close"
          id="early-access-popup-close"
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00c8ff]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className={`relative ${isMobile ? 'px-5 pb-6 pt-4' : 'p-8 sm:p-9'}`}>
          {success ? (
            <div role="status" aria-live="polite">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#00c8ff]/50 bg-[#00c8ff]/10 text-[#00c8ff] shadow-[0_0_20px_rgba(0,200,255,0.35)]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <h2 id="ea-popup-heading" className="pr-8 text-xl font-extrabold leading-tight text-white sm:text-2xl">
                {COPY.confirmation.headline}
              </h2>
              <p id="ea-popup-body" className="mt-3 text-sm leading-relaxed text-slate-300">
                {COPY.confirmation.body}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={COPY.confirmation.primaryCta.href}
                  onClick={() => {
                    track('early_access_popup_cta', { cta: 'see_in_action' });
                    setOpen(false);
                  }}
                  id="early-access-popup-demo"
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center border-2 border-[#00c8ff] bg-[#00c8ff] px-5 font-display text-sm font-bold uppercase tracking-[0.08em] text-[#020617] shadow-[0_0_18px_rgba(0,200,255,0.5)] transition-all hover:border-white hover:bg-white active:scale-[0.98]"
                >
                  {COPY.confirmation.primaryCta.label}
                </Link>
                <Link
                  href={COPY.confirmation.secondaryCta.href}
                  onClick={() => {
                    track('early_access_popup_cta', { cta: 'continue_to_early_access' });
                    setOpen(false);
                  }}
                  id="early-access-popup-apply"
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center border-2 border-white/25 px-5 font-display text-sm font-bold uppercase tracking-[0.08em] text-white transition-all hover:border-[#7b4fce] hover:shadow-[0_0_15px_#7b4fce] active:scale-[0.98]"
                >
                  {COPY.confirmation.secondaryCta.label}
                </Link>
              </div>
            </div>
          ) : (
            <>
              <p className="inline-block border border-[#7b4fce]/70 bg-black/40 px-2.5 py-1 font-display text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[#a78bfa]">
                {COPY.eyebrow}
              </p>
              <h2 id="ea-popup-heading" className="mt-4 pr-8 font-display text-2xl font-extrabold leading-[1.15] text-white sm:text-[1.75rem]">
                Don’t Just Use AI. <span className="text-[#00c8ff] text-glow-cyan">Learn to Build With It.</span>
              </h2>
              <div id="ea-popup-body">
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{COPY.body}</p>
                {!isMobile && <p className="mt-2 text-sm leading-relaxed text-slate-400">{COPY.parentLine}</p>}
              </div>

              <ul className={`mt-5 grid gap-2 ${isMobile ? '' : 'sm:grid-cols-2'}`}>
                {COPY.valuePoints.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-[13px] leading-snug text-slate-200">
                    <span className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#00c8ff]/15 text-[#00c8ff]" aria-hidden="true">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </span>
                    {point}
                  </li>
                ))}
              </ul>

              <form action={formAction} className="mt-6">
                <input type="hidden" name="sourcePath" value={pathname} />
                <input type="hidden" name="trigger" value={trigger ?? ''} />
                {/* Honeypot: hidden from humans and assistive tech */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label htmlFor="ea-company">Company</label>
                  <input id="ea-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <label htmlFor="early-access-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Parent or guardian email
                </label>
                <div className="flex flex-col gap-2.5 sm:flex-row">
                  <input
                    ref={emailRef}
                    id="early-access-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    aria-invalid={state.status === 'error'}
                    aria-describedby={state.status === 'error' ? 'ea-popup-error' : 'ea-popup-consent'}
                    className="min-h-[48px] w-full flex-1 border border-slate-600 bg-black/40 px-4 font-mono text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-[#00c8ff] focus:shadow-[0_0_14px_rgba(0,200,255,0.35)]"
                  />
                  <button
                    id="early-access-submit"
                    type="submit"
                    disabled={pending}
                    className="inline-flex min-h-[48px] items-center justify-center whitespace-nowrap border-2 border-[#00c8ff] bg-[#00c8ff] px-6 font-display text-sm font-bold uppercase tracking-[0.08em] text-[#020617] shadow-[0_0_20px_rgba(0,200,255,0.55)] transition-all hover:border-white hover:bg-white active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
                  >
                    {pending ? 'Sending…' : COPY.cta}
                  </button>
                </div>

                {state.status === 'error' && (
                  <p id="ea-popup-error" role="alert" className="mt-2 text-xs font-medium text-red-400">
                    {state.message}
                  </p>
                )}

                <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-wider text-[#00c8ff]/90">
                  {COPY.trustLine.map((item, i) => (
                    <span key={item} className="flex items-center gap-2">
                      {i > 0 && <span className="text-slate-600" aria-hidden="true">·</span>}
                      {item}
                    </span>
                  ))}
                </p>
                <p id="ea-popup-consent" className="mt-2 text-[11px] leading-relaxed text-slate-500">
                  {EARLY_ACCESS_CONSENT_TEXT}{' '}
                  <Link href="/privacy" className="underline hover:text-slate-300" onClick={() => setOpen(false)}>
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
