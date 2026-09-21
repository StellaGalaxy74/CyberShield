import React from 'react';
import { RedFlag } from '../types';
import { AlertCircle, Flame, ShieldAlert, Info } from 'lucide-react';

interface RedFlagCardProps {
  redFlag: RedFlag;
  index: number;
}

export const RedFlagCard: React.FC<RedFlagCardProps> = ({ redFlag, index }) => {
  const getSeverityBadge = (severity: string) => {
    switch (severity.toUpperCase()) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-950/80 border-rose-500/50 text-rose-300',
          dot: 'bg-rose-500',
          icon: Flame,
          border: 'border-l-4 border-l-rose-500',
        };
      case 'HIGH':
        return {
          bg: 'bg-amber-950/80 border-amber-500/50 text-amber-300',
          dot: 'bg-amber-500',
          icon: ShieldAlert,
          border: 'border-l-4 border-l-amber-500',
        };
      case 'MEDIUM':
        return {
          bg: 'bg-yellow-950/80 border-yellow-500/50 text-yellow-300',
          dot: 'bg-yellow-400',
          icon: AlertCircle,
          border: 'border-l-4 border-l-yellow-500',
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-blue-950/80 border-blue-500/50 text-blue-300',
          dot: 'bg-blue-400',
          icon: Info,
          border: 'border-l-4 border-l-blue-500',
        };
    }
  };

  const style = getSeverityBadge(redFlag.severity);
  const Icon = style.icon;

  return (
    <div
      id={`red-flag-card-${index}`}
      className={`p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 ${style.border} shadow-md transition-all hover:bg-slate-900`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-slate-300 shrink-0" />
          <h4 className="font-semibold text-slate-100 text-sm tracking-wide">
            {redFlag.indicator}
          </h4>
        </div>

        <span
          className={`text-[11px] px-2 py-0.5 rounded-full border font-mono-code font-bold uppercase shrink-0 ${style.bg}`}
        >
          {redFlag.severity} SEVERITY
        </span>
      </div>

      {/* Observable Evidence Quote */}
      {redFlag.evidence && (
        <div className="my-2.5 px-3 py-2 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-cyan-200 font-mono-code leading-relaxed break-words">
          <span className="text-slate-500 select-none mr-2">&gt;</span>
          &ldquo;{redFlag.evidence}&rdquo;
        </div>
      )}

      {/* Analytical Explanation */}
      <p className="text-xs text-slate-300 leading-relaxed">
        {redFlag.explanation}
      </p>
    </div>
  );
};
