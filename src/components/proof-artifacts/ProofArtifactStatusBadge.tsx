import React from 'react';
import { ArtifactStatus, getArtifactStatusLabel } from '@/lib/proof-artifacts/state-machine';
import { CheckCircle2, Clock, AlertCircle, RefreshCw, Edit3 } from 'lucide-react';

interface Props {
  status: ArtifactStatus;
  className?: string;
}

export function ProofArtifactStatusBadge({ status, className = '' }: Props) {
  let colorClass = '';
  let Icon = Clock;

  switch (status) {
    case 'draft':
      colorClass = 'text-slate-400 border-slate-600 bg-slate-800';
      Icon = Edit3;
      break;
    case 'submitted':
      colorClass = 'text-[#00c8ff] border-[#00c8ff] bg-[#00c8ff]/10';
      Icon = Clock;
      break;
    case 'under_review':
      colorClass = 'text-amber-400 border-amber-400 bg-amber-400/10';
      Icon = RefreshCw;
      break;
    case 'approved':
      colorClass = 'text-[#39ff14] border-[#39ff14] bg-[#39ff14]/10';
      Icon = CheckCircle2;
      break;
    case 'rejected':
      colorClass = 'text-red-400 border-red-400 bg-red-400/10';
      Icon = AlertCircle;
      break;
    case 'revise':
      colorClass = 'text-[#7b4fce] border-[#7b4fce] bg-[#7b4fce]/10';
      Icon = AlertCircle;
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest border rounded-sm ${colorClass} ${className}`}>
      <Icon className="w-3 h-3" />
      {getArtifactStatusLabel(status)}
    </span>
  );
}
