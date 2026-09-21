import React from 'react';
import { RiskLevel } from '../types';

interface RiskScoreProps {
  score: number;
  level: RiskLevel;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  explanation?: string;
}

export const RiskScore: React.FC<RiskScoreProps> = ({
  score,
  level,
  confidence,
  explanation,
}) => {
  // SVG circular gauge calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  const getColorTheme = () => {
    switch (level) {
      case 'CRITICAL':
        return {
          stroke: '#f43f5e',
          text: 'text-rose-400',
          glow: 'drop-shadow-[0_0_12px_rgba(244,63,94,0.5)]',
          badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          desc: 'High probability of malicious intent, credential harvesting, or financial extraction.',
        };
      case 'HIGH':
        return {
          stroke: '#f59e0b',
          text: 'text-amber-400',
          glow: 'drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]',
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          desc: 'Substantial threat indicators detected. Extreme caution and verification required.',
        };
      case 'SUSPICIOUS':
        return {
          stroke: '#eab308',
          text: 'text-yellow-400',
          glow: 'drop-shadow-[0_0_12px_rgba(234,179,8,0.4)]',
          badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
          desc: 'Anomalous or manipulative patterns detected. Do not click links or share details.',
        };
      case 'LOW':
      default:
        return {
          stroke: '#10b981',
          text: 'text-emerald-400',
          glow: 'drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]',
          badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          desc: 'Minimal scam signatures observed. Content appears consistent with legitimate norms.',
        };
    }
  };

  const theme = getColorTheme();

  return (
    <div
      id="investigation-risk-score-card"
      className="relative flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-hidden backdrop-blur-md"
    >
      {/* Background ambient gradient glow */}
      <div
        className="absolute -right-12 -top-12 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: theme.stroke }}
      />

      {/* Radial Gauge */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg className="w-36 h-36 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            className="text-slate-800"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke={theme.stroke}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-out ${theme.glow}`}
            fill="transparent"
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-4xl font-extrabold tracking-tight font-mono-code ${theme.text}`}>
            {normalizedScore}
          </span>
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold mt-0.5">
            / 100
          </span>
        </div>
      </div>

      {/* Contextual Description & Confidence */}
      <div className="flex-1 space-y-2.5 text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            Threat Evaluation
          </span>
          <span className={`text-xs px-2.5 py-0.5 rounded-full border font-mono-code ${theme.badge}`}>
            CONFIDENCE: {confidence}
          </span>
        </div>

        <h3 className={`text-2xl font-bold tracking-tight ${theme.text}`}>
          {level} RISK THREAT LEVEL
        </h3>

        <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
          {explanation || theme.desc}
        </p>

        {/* Score scale legend */}
        <div className="pt-2 flex items-center justify-between gap-1 text-[11px] text-slate-500 font-mono-code max-w-md">
          <span className="text-emerald-400">0-25 Low</span>
          <span className="text-yellow-400">26-55 Suspicious</span>
          <span className="text-amber-400">56-80 High</span>
          <span className="text-rose-400">81-100 Critical</span>
        </div>
      </div>
    </div>
  );
};
