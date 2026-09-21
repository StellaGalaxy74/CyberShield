import React from 'react';
import { IndiaGuidance } from '../types';
import {
  ShieldAlert,
  CheckSquare2,
  PhoneCall,
  AlertTriangle,
  ExternalLink,
  Lock,
  Landmark,
  FileCheck2,
} from 'lucide-react';

interface RecommendationCardProps {
  recommendations: string[];
  indiaGuidance?: IndiaGuidance;
  isOtpOrKycRisk?: boolean;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendations,
  indiaGuidance,
  isOtpOrKycRisk = true,
}) => {
  return (
    <div className="space-y-4">
      {/* Prominent Golden Rule Warning for OTP/PIN/KYC */}
      {isOtpOrKycRisk && (
        <div
          id="otp-golden-rule-banner"
          className="p-4 rounded-xl bg-gradient-to-r from-rose-950/90 to-amber-950/80 border-2 border-rose-500/70 shadow-lg flex items-start gap-3"
        >
          <div className="p-2 rounded-lg bg-rose-900/60 text-rose-300 shrink-0">
            <Lock className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-rose-400 block">
              CRITICAL SAFETY DIRECTIVE
            </span>
            <p className="text-sm md:text-base font-bold text-white leading-snug">
              Never share OTPs, UPI PINs, CVVs, or passwords with anyone — even if they claim to be bank officials, police, or customer support.
            </p>
            <p className="text-xs text-rose-200/80">
              Entering a UPI PIN is strictly for sending money, never for receiving refunds or cashback.
            </p>
          </div>
        </div>
      )}

      {/* Actionable Incident Mitigation Checklist */}
      <div
        id="recommended-actions-card"
        className="p-5 rounded-2xl bg-slate-900/85 border border-slate-800 shadow-xl space-y-3"
      >
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <CheckSquare2 className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-base font-bold text-slate-100">Prescribed Response Protocol</h3>
            <p className="text-xs text-slate-400">
              Immediate containment and remediation steps to neutralize personal and financial exposure
            </p>
          </div>
        </div>

        <ul className="space-y-2.5 pt-1">
          {recommendations.map((action, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs md:text-sm text-slate-200"
            >
              <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center text-[11px] font-mono-code shrink-0 mt-0.5 font-bold">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{action}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* India-Focused Cybercrime Assistance (Official Resources) */}
      {indiaGuidance && (
        <div
          id="india-cybercrime-guidance"
          className="p-5 rounded-2xl bg-slate-900/85 border border-indigo-900/60 shadow-xl space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <Landmark className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  Official India Cybercrime & Grievance Directory
                </h3>
                <p className="text-xs text-slate-400">
                  Government of India (I4C, MHA) verified reporting channels
                </p>
              </div>
            </div>

            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-950/70 text-indigo-300 border border-indigo-700/60 font-mono-code">
              OFFICIAL CHANNELS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1930 Helpline Callout */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-900/80 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-950 text-indigo-400 shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono-code block">
                  National Cybercrime Helpline
                </span>
                <span className="text-xl font-extrabold text-indigo-300 font-mono-code">
                  1930
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Toll-Free (24x7 Golden Hour Support)
                </span>
              </div>
            </div>

            {/* Portal link */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-900/80 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono-code block">
                  Formal Complaint Filing
                </span>
                <span className="text-sm font-bold text-slate-200 block">
                  cybercrime.gov.in
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  I4C Citizen Financial Fraud Portal
                </span>
              </div>

              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition"
              >
                <span>Visit</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Chakshu Portal note */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1">
            <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5" /> Telecom Number & SMS Reporting (Chakshu):
            </span>
            <p className="text-slate-400 leading-relaxed">
              Report suspected fraud communications, unsolicited fake calls, and smishing WhatsApp numbers on DoT&apos;s Sanchar Saathi (sancharsaathi.gov.in/sfc) to block perpetrator IMEI and SIM assets nationwide.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
