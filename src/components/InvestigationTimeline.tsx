import React from 'react';
import { TimelineEvent } from '../types';
import { GitCommit, ArrowDown, AlertCircle } from 'lucide-react';

interface InvestigationTimelineProps {
  timeline: TimelineEvent[];
}

export const InvestigationTimeline: React.FC<InvestigationTimelineProps> = ({ timeline }) => {
  if (!timeline || timeline.length === 0) return null;

  const getStepStyle = (risk: string) => {
    switch (risk?.toUpperCase()) {
      case 'CRITICAL':
        return {
          dot: 'bg-rose-500 ring-4 ring-rose-950 text-rose-300 border-rose-500',
          badge: 'bg-rose-950/80 text-rose-300 border-rose-600/60',
          line: 'border-rose-500/40',
        };
      case 'ELEVATED':
        return {
          dot: 'bg-amber-500 ring-4 ring-amber-950 text-amber-300 border-amber-500',
          badge: 'bg-amber-950/80 text-amber-300 border-amber-600/60',
          line: 'border-amber-500/40',
        };
      case 'NORMAL':
      default:
        return {
          dot: 'bg-cyan-500 ring-4 ring-cyan-950 text-cyan-300 border-cyan-500',
          badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-600/60',
          line: 'border-cyan-500/40',
        };
    }
  };

  return (
    <div
      id="investigation-timeline-card"
      className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4"
    >
      <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
        <GitCommit className="w-5 h-5 text-cyan-400" />
        <div>
          <h3 className="text-base font-bold text-slate-100">Chronological Threat Escalation Timeline</h3>
          <p className="text-xs text-slate-400">
            Reconstruction of interaction flow and coercive pressure stages
          </p>
        </div>
      </div>

      <div className="relative pl-6 space-y-6 pt-2 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
        {timeline.map((event, idx) => {
          const style = getStepStyle(event.riskEscalation);
          const isLast = idx === timeline.length - 1;

          return (
            <div key={idx} className="relative group">
              {/* Timeline marker */}
              <div
                className={`absolute -left-6 top-1 w-5 h-5 rounded-full border flex items-center justify-center transition-transform group-hover:scale-110 ${style.dot}`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>

              {/* Event Content Box */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/90 shadow-sm transition hover:bg-slate-950">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-mono-code font-bold text-cyan-400">
                    {event.timeOrStep}
                  </span>

                  <span
                    className={`text-[10px] uppercase font-mono-code px-2 py-0.5 rounded border font-semibold ${style.badge}`}
                  >
                    {event.riskEscalation} RISK
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-200">
                  {event.action}
                </p>

                {event.description && (
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {event.description}
                  </p>
                )}
              </div>

              {!isLast && (
                <div className="flex justify-center my-1">
                  <ArrowDown className="w-3.5 h-3.5 text-slate-700" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
