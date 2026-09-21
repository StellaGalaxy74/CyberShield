import React, { useState } from 'react';
import { ExtractedEntities } from '../types';
import {
  Link2,
  Phone,
  Mail,
  CreditCard,
  Building,
  Key,
  FileSearch,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface EvidencePanelProps {
  entities: ExtractedEntities;
  rawSnippet?: string;
  ocrText?: string;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  entities,
  rawSnippet,
  ocrText,
}) => {
  const [unmaskSensitive, setUnmaskSensitive] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('urls');

  // Privacy masking helper
  const maskString = (val: string, type: 'phone' | 'email' | 'payment') => {
    if (unmaskSensitive) return val;
    if (type === 'phone') {
      return val.replace(/(\+?\d{2,4}[-\s]?)(\d{2})\d{4,6}(\d{2})/, '$1$2******$3');
    }
    if (type === 'email') {
      const parts = val.split('@');
      if (parts.length === 2) {
        const name = parts[0];
        const maskedName = name.length > 2 ? `${name[0]}****${name[name.length - 1]}` : `${name}***`;
        return `${maskedName}@${parts[1]}`;
      }
    }
    if (type === 'payment') {
      const parts = val.split('@');
      if (parts.length === 2) {
        return `${parts[0].slice(0, 2)}****@${parts[1]}`;
      }
      return val.slice(0, 3) + '****' + val.slice(-3);
    }
    return val;
  };

  const toggleSection = (name: string) => {
    setExpandedSection(expandedSection === name ? null : name);
  };

  const totalEntities =
    (entities.urls?.length || 0) +
    (entities.phone_numbers?.length || 0) +
    (entities.emails?.length || 0) +
    (entities.payment_identifiers?.length || 0) +
    (entities.organizations?.length || 0) +
    (entities.suspicious_keywords?.length || 0);

  return (
    <div
      id="investigation-evidence-panel"
      className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <FileSearch className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-base font-bold text-slate-100">Forensic Evidence Vault</h3>
            <p className="text-xs text-slate-400">
              Extracted artifacts, identifiers, and parsed tokens ({totalEntities} detected)
            </p>
          </div>
        </div>

        {/* Sensitive data privacy mask toggle */}
        <button
          onClick={() => setUnmaskSensitive(!unmaskSensitive)}
          className="no-print inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs font-medium border border-slate-700 transition cursor-pointer"
          title="Toggle sensitive data masking for PII protection"
        >
          {unmaskSensitive ? (
            <>
              <EyeOff className="w-3.5 h-3.5 text-amber-400" />
              <span>Mask PII</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Reveal Full PII</span>
            </>
          )}
        </button>
      </div>

      {/* OCR / Extracted text preview if screenshot was uploaded */}
      {ocrText && ocrText !== rawSnippet && (
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90 text-xs">
          <span className="font-semibold text-cyan-400 block mb-1">
            Vision OCR Extracted Content:
          </span>
          <p className="text-slate-300 font-mono-code leading-relaxed max-h-32 print:max-h-none overflow-y-auto print:overflow-visible whitespace-pre-wrap">
            {ocrText}
          </p>
        </div>
      )}

      {/* Grid of Entity Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* URLs */}
        <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
          <button
            onClick={() => toggleSection('urls')}
            className="w-full flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
              <Link2 className="w-4 h-4 text-cyan-400" />
              <span>Extracted URLs ({entities.urls?.length || 0})</span>
            </div>
            {expandedSection === 'urls' ? (
              <ChevronUp className="w-4 h-4 text-slate-400 no-print" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400 no-print" />
            )}
          </button>

          <div className={`mt-2.5 space-y-1.5 ${expandedSection === 'urls' ? 'block' : 'hidden print:block'}`}>
            {entities.urls?.length > 0 ? (
              entities.urls.map((u, i) => (
                <div
                  key={i}
                  className="text-xs font-mono-code px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-cyan-200 break-all select-all flex items-center justify-between gap-2"
                >
                  <span>{u}</span>
                  <span className="text-[10px] text-slate-500 uppercase shrink-0">Target</span>
                </div>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">No external URLs detected</span>
            )}
          </div>
        </div>

        {/* Payment Identifiers / UPI */}
        <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
          <button
            onClick={() => toggleSection('payments')}
            className="w-full flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Payment & UPI IDs ({entities.payment_identifiers?.length || 0})</span>
            </div>
            {expandedSection === 'payments' ? (
              <ChevronUp className="w-4 h-4 text-slate-400 no-print" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400 no-print" />
            )}
          </button>

          <div className={`mt-2.5 space-y-1.5 ${expandedSection === 'payments' ? 'block' : 'hidden print:block'}`}>
            {entities.payment_identifiers?.length > 0 ? (
              entities.payment_identifiers.map((p, i) => (
                <div
                  key={i}
                  className="text-xs font-mono-code px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-emerald-300 break-all select-all flex items-center justify-between gap-2"
                >
                  <span>{maskString(p, 'payment')}</span>
                  <span className="text-[10px] text-emerald-500 uppercase shrink-0">VPA / Acc</span>
                </div>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">No payment addresses detected</span>
            )}
          </div>
        </div>

        {/* Phone Numbers */}
        <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
          <button
            onClick={() => toggleSection('phones')}
            className="w-full flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
              <Phone className="w-4 h-4 text-purple-400" />
              <span>Phone Numbers ({entities.phone_numbers?.length || 0})</span>
            </div>
            {expandedSection === 'phones' ? (
              <ChevronUp className="w-4 h-4 text-slate-400 no-print" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400 no-print" />
            )}
          </button>

          <div className={`mt-2.5 space-y-1.5 ${expandedSection === 'phones' ? 'block' : 'hidden print:block'}`}>
            {entities.phone_numbers?.length > 0 ? (
              entities.phone_numbers.map((p, i) => (
                <div
                  key={i}
                  className="text-xs font-mono-code px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-purple-200 select-all"
                >
                  {maskString(p, 'phone')}
                </div>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">No phone numbers detected</span>
            )}
          </div>
        </div>

        {/* Emails */}
        <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
          <button
            onClick={() => toggleSection('emails')}
            className="w-full flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-300">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>Email Addresses ({entities.emails?.length || 0})</span>
            </div>
            {expandedSection === 'emails' ? (
              <ChevronUp className="w-4 h-4 text-slate-400 no-print" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400 no-print" />
            )}
          </button>

          <div className={`mt-2.5 space-y-1.5 ${expandedSection === 'emails' ? 'block' : 'hidden print:block'}`}>
            {entities.emails?.length > 0 ? (
              entities.emails.map((e, i) => (
                <div
                  key={i}
                  className="text-xs font-mono-code px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-blue-200 select-all"
                >
                  {maskString(e, 'email')}
                </div>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">No emails detected</span>
            )}
          </div>
        </div>

        {/* Mentioned Organizations */}
        <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
          <button
            onClick={() => toggleSection('orgs')}
            className="w-full flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
              <Building className="w-4 h-4 text-amber-400" />
              <span>Referenced Brands / Entities ({entities.organizations?.length || 0})</span>
            </div>
            {expandedSection === 'orgs' ? (
              <ChevronUp className="w-4 h-4 text-slate-400 no-print" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400 no-print" />
            )}
          </button>

          <div className={`mt-2.5 flex flex-wrap gap-1.5 ${expandedSection === 'orgs' ? 'flex' : 'hidden print:flex'}`}>
            {entities.organizations?.length > 0 ? (
              entities.organizations.map((org, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-md bg-amber-950/40 text-amber-300 border border-amber-800/50 font-medium"
                >
                  {org}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">No specific brands identified</span>
            )}
          </div>
        </div>

        {/* Suspicious Keywords */}
        <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
          <button
            onClick={() => toggleSection('keywords')}
            className="w-full flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-300">
              <Key className="w-4 h-4 text-rose-400" />
              <span>Trigger Phrases ({entities.suspicious_keywords?.length || 0})</span>
            </div>
            {expandedSection === 'keywords' ? (
              <ChevronUp className="w-4 h-4 text-slate-400 no-print" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400 no-print" />
            )}
          </button>

          <div className={`mt-2.5 flex flex-wrap gap-1.5 ${expandedSection === 'keywords' ? 'flex' : 'hidden print:flex'}`}>
            {entities.suspicious_keywords?.length > 0 ? (
              entities.suspicious_keywords.map((k, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 rounded bg-rose-950/40 text-rose-300 border border-rose-800/40 font-mono-code"
                >
                  {k}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">No high-risk keywords flagged</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
