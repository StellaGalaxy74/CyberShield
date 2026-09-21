import React from 'react';
import { DEMO_SAMPLES } from '../data/demoSamples';
import { DemoSample } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Zap,
  ArrowRight,
  Eye,
  Globe,
  Lock,
  PhoneCall,
  Sparkles,
  Layers,
  AlertOctagon,
} from 'lucide-react';

interface LandingHeroProps {
  onStartInvestigation: () => void;
  onSelectSample: (sample: DemoSample) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartInvestigation,
  onSelectSample,
}) => {
  return (
    <div id="landing-page-hero" className="space-y-12 py-4">
      {/* Primary Hero Header */}
      <div className="relative text-center max-w-4xl mx-auto space-y-6 pt-6">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-700/50 text-cyan-300 text-xs font-mono-code font-semibold tracking-wide shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>CYBERSHIELD AI DEFENSE ENGINE v2.4</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Investigate. Detect. Protect.
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          AI-powered cyber scam investigation that turns suspicious messages, links, and screenshots into actionable security intelligence.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onStartInvestigation}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-base flex items-center gap-2.5 shadow-xl shadow-cyan-500/20 transition transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Search className="w-5 h-5" />
            <span>Start Investigation</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Live Threat Ticker */}
        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase font-mono-code text-slate-400 block">Analysis Engine</span>
            <span className="text-sm font-bold text-cyan-400 font-mono-code">Gemini 3 Multimodal</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase font-mono-code text-slate-400 block">Scam Signatures</span>
            <span className="text-sm font-bold text-emerald-400 font-mono-code">42+ Threat Patterns</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase font-mono-code text-slate-400 block">Jurisdiction Directives</span>
            <span className="text-sm font-bold text-amber-400 font-mono-code">India 1930 / I4C Portal</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase font-mono-code text-slate-400 block">PII Protection</span>
            <span className="text-sm font-bold text-blue-400 font-mono-code">Local Client Redaction</span>
          </div>
        </div>
      </div>

      {/* Interactive Demo Cases Picker */}
      <div className="space-y-4 max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Explore Interactive Sample Scenarios</span>
            </h2>
            <p className="text-xs text-slate-400">
              Click any safe sample below to test the automated investigative pipeline immediately
            </p>
          </div>
          <span className="text-xs font-mono-code text-slate-500">SAFE TEST FIXTURES</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {DEMO_SAMPLES.slice(0, 4).map((sample) => (
            <div
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className="p-4 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition flex flex-col justify-between group shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono-code font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {sample.label}
                  </span>
                  <span
                    className={`text-[10px] font-mono-code font-bold px-1.5 py-0.5 rounded ${
                      sample.expectedRisk === 'CRITICAL'
                        ? 'bg-rose-950 text-rose-400'
                        : sample.expectedRisk === 'HIGH'
                        ? 'bg-amber-950 text-amber-400'
                        : 'bg-emerald-950 text-emerald-400'
                    }`}
                  >
                    {sample.expectedRisk}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition line-clamp-1">
                  {sample.title}
                </h3>

                <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                  &ldquo;{sample.content}&rdquo;
                </p>
              </div>

              <div className="pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>Inspect Scenario</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 text-cyan-400 flex items-center justify-center border border-cyan-800/50">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-100">Multimodal Screenshot OCR</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Upload images of WhatsApp extortion chats, suspicious UPI payment approvals, fake KYC letters, and QR codes for high-precision neural text extraction and threat profiling.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-950/80 text-amber-400 flex items-center justify-center border border-amber-800/50">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-100">Explainable Heuristic Analysis</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Avoids simple black-box verdicts. Provides line-by-line red flags, psychological urgency markers, credential harvesting alerts, and strict distinction between observed evidence and inference.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-950/80 text-indigo-400 flex items-center justify-center border border-indigo-800/50">
            <PhoneCall className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-100">National Cybercrime Integration</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Tailored emergency guidance for Indian citizens, incorporating immediate 1930 Golden Hour freeze protocols, cybercrime.gov.in complaint templates, and DoT Chakshu SIM blocking.
          </p>
        </div>
      </div>
    </div>
  );
};
