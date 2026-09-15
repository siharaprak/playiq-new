'use client';

import React from 'react';
import { FileText, Download, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';

interface ModulePdfDownloadProps {
  moduleNumber: number | 'capstone' | 'master';
  title?: string;
  className?: string;
}

const PDF_DATA: Record<string, { fileName: string; label: string; size: string }> = {
  '0': { fileName: 'Module_0_Student_Text.pdf', label: 'Module 0 Student Guide', size: '401 KB' },
  '1': { fileName: 'Module_1_Student_Text.pdf', label: 'Module 1 Student Guide', size: '377 KB' },
  '2': { fileName: 'Module_2_Student_Text.pdf', label: 'Module 2 Student Guide', size: '319 KB' },
  '3': { fileName: 'Module_3_Student_Text.pdf', label: 'Module 3 Student Guide', size: '364 KB' },
  '4': { fileName: 'Module_4_Student_Text.pdf', label: 'Module 4 Student Guide', size: '233 KB' },
  '5': { fileName: 'Module_5_Student_Text.pdf', label: 'Module 5 Student Guide', size: '231 KB' },
  '6': { fileName: 'Module_6_Student_Text.pdf', label: 'Module 6 Student Guide', size: '283 KB' },
  '7': { fileName: 'Module_7_Student_Text.pdf', label: 'Module 7 Student Guide', size: '278 KB' },
  '8': { fileName: 'Module_8_Student_Text.pdf', label: 'Module 8 Student Guide', size: '278 KB' },
  '9': { fileName: 'Module_9_Student_Text.pdf', label: 'Module 9 Student Guide', size: '438 KB' },
  '10': { fileName: 'Module_10_Student_Text.pdf', label: 'Module 10 Student Guide', size: '220 KB' },
  '11': { fileName: 'Capstone_Student_Text.pdf', label: 'Capstone Master Trial Guide', size: '329 KB' },
  'capstone': { fileName: 'Capstone_Student_Text.pdf', label: 'Capstone Master Trial Guide', size: '329 KB' },
  'master': { fileName: 'PLAYIQ_CURRENT_COMBINED_COURSE_MASTER_20260915.pdf', label: 'Complete Course Master PDF (Modules 0-11)', size: '3.6 MB' },
};

export default function ModulePdfDownload({ moduleNumber, title, className = '' }: ModulePdfDownloadProps) {
  const key = String(moduleNumber);
  const pdfInfo = PDF_DATA[key] || {
    fileName: `Module_${moduleNumber}_Student_Text.pdf`,
    label: title || `Module ${moduleNumber} Student Guide`,
    size: 'PDF Document',
  };

  const isMaster = key === 'master';
  const href = isMaster ? `/curriculum/${pdfInfo.fileName}` : `/curriculum/pdf/${pdfInfo.fileName}`;

  return (
    <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300 ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(0, 200, 255, 0.04) 0%, rgba(13, 22, 38, 0.6) 100%)',
        borderColor: 'rgba(0, 200, 255, 0.25)',
      }}
    >
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border"
          style={{
            background: 'rgba(0, 200, 255, 0.1)',
            borderColor: 'rgba(0, 200, 255, 0.3)',
            color: 'var(--neon-cyan)',
          }}
        >
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold tracking-wide" style={{ color: 'var(--text-primary)' }}>
              {pdfInfo.label}
            </h4>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border bg-emerald-950/40 text-emerald-400 border-emerald-500/30">
              <ShieldCheck className="w-3 h-3" /> Verified Master
            </span>
          </div>
          <p className="text-xs mt-1 text-slate-400 font-mono">
            Unabridged curriculum text, offline reading & printable exercises • {pdfInfo.size}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider font-mono border transition-all duration-200 group"
          style={{
            background: 'rgba(0, 200, 255, 0.12)',
            borderColor: 'var(--neon-cyan)',
            color: 'var(--neon-cyan)',
          }}
        >
          <Download className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          <span>Download PDF</span>
        </a>
      </div>
    </div>
  );
}
