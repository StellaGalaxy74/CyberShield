import React from 'react';
import { UrlInspectionDetails } from '../types';
import {
  Globe,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Server,
  Layers,
} from 'lucide-react';

interface UrlInspectorProps {
  inspection: UrlInspectionDetails;
}

export const UrlInspector: React.FC<UrlInspectorProps> = ({ inspection }) => {
  const isSecure = inspection.protocol === 'https';

  return (
    <div
      id="url-inspection-card"
      className="p-5 rounded-2xl bg-slate-900/85 border border-slate-800 shadow-xl space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-base font-bold text-slate-100">Deep URL & Domain Heuristics</h3>
            <p className="text-xs text-slate-400">
              Structural decomposition, protocol verification, and brand lookalike detection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSecure ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-mono-code">
              <Lock className="w-3.5 h-3.5" />
              HTTPS ENCRYPTED
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-950/60 border border-rose-800/60 text-rose-400 text-xs font-mono-code font-bold animate-pulse">
              <Unlock className="w-3.5 h-3.5" />
              INSECURE (HTTP)
            </span>
          )}
        </div>
      </div>

      {/* Target URL Raw banner */}
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-mono-code text-slate-500 uppercase shrink-0">Analyzed Target:</span>
          <span className="text-xs font-mono-code text-cyan-300 truncate select-all">
            {inspection.analyzedUrl}
          </span>
        </div>
        <span className="text-[11px] text-slate-500 flex items-center gap-1 shrink-0 font-mono-code">
          <ExternalLink className="w-3 h-3" /> Sandbox Mode
        </span>
      </div>

      {/* Structural breakdown pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
          <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-1">Domain</span>
          <span className="font-mono-code font-semibold text-slate-200 break-all">
            {inspection.domain || 'N/A'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
          <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-1">Top-Level Domain (TLD)</span>
          <span className="font-mono-code font-semibold text-cyan-400">
            .{inspection.tld}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
          <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-1">Lookalike / Typo</span>
          {inspection.isLookalike ? (
            <span className="text-rose-400 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Detected
            </span>
          ) : (
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> None Detected
            </span>
          )}
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
          <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-1">URL Shortener</span>
          {inspection.isShortener ? (
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Shortener Used
            </span>
          ) : (
            <span className="text-slate-300">Direct FQDN</span>
          )}
        </div>
      </div>

      {/* Epistemological Distinction: Observed Evidence vs AI Inference vs Unverified */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
        {/* Observed Evidence */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-cyan-950/60 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wide">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Observed Evidence</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            {inspection.observedEvidence?.map((ev, i) => (
              <li key={i} className="leading-relaxed">{ev}</li>
            ))}
            {(!inspection.observedEvidence || inspection.observedEvidence.length === 0) && (
              <li className="text-slate-500 italic">No direct static anomalies logged</li>
            )}
          </ul>
        </div>

        {/* AI Threat Inference */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-amber-950/60 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wide">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>AI Threat Inference</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            {inspection.aiInference?.map((inf, i) => (
              <li key={i} className="leading-relaxed">{inf}</li>
            ))}
            {(!inspection.aiInference || inspection.aiInference.length === 0) && (
              <li className="text-slate-500 italic">Pattern heuristics within standard parameters</li>
            )}
          </ul>
        </div>

        {/* Unverified Information */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wide">
            <Server className="w-3.5 h-3.5" />
            <span>Unverified Aspects</span>
          </div>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
            {inspection.unverifiedAspects?.map((unv, i) => (
              <li key={i} className="leading-relaxed">{unv}</li>
            ))}
            {(!inspection.unverifiedAspects || inspection.unverifiedAspects.length === 0) && (
              <li className="text-slate-500 italic">Backend hosting infrastructure not actively scanned</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
