import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Eye,
  AlertTriangle,
  FileText,
  PhoneCall,
  CheckCircle2,
  HelpCircle,
  BookOpen,
} from 'lucide-react';

export const AboutSafetyPage: React.FC = () => {
  const commonScamPlaybooks = [
    {
      title: 'Digital Arrest / Fake Police / Customs Extortion',
      modality: 'WhatsApp Video / Phone call / SMS',
      modusOperandi:
        'Fraudsters impersonate CBI, Mumbai Police, or Customs officers claiming a parcel containing narcotics or your Aadhaar was intercepted. They place targets under fictitious "Digital Arrest" via video call and coerce immediate bank transfers.',
      defense:
        'There is NO provision in Indian law for "Digital Arrest". Real law enforcement agencies never issue summons via WhatsApp or demand security deposits to clear warrants.',
    },
    {
      title: 'Electricity / Utility Bill Disconnection Scam',
      modality: 'SMS',
      modusOperandi:
        '"Dear consumer, your electricity power will be disconnected tonight at 9:30 PM due to unpaid bill. Immediately contact power officer at 98XXXXXX."',
      defense:
        'Electricity distribution boards never send SMS from personal 10-digit mobile numbers. Bills should solely be checked on official state DISCOM portals or BBPS apps.',
    },
    {
      title: 'Part-Time Telegram Task / Rating Scams',
      modality: 'WhatsApp / Telegram',
      modusOperandi:
        'Victims are paid small initial rewards (₹150–₹500) for liking YouTube videos or reviewing Google maps, then coerced into "prepaid merchant tasks" requiring large deposits of thousands to lakhs before withdrawals are frozen.',
      defense:
        'Legitimate companies never ask workers to pay money to receive task payouts. Never join unregulated Telegram task groups.',
    },
    {
      title: 'UPI PIN "Refund / Receive Money" Trap',
      modality: 'Google Pay / PhonePe / Paytm',
      modusOperandi:
        'Scammer claims they accidentally sent you extra money or you won a scratch card. They send a "Collect" request or QR code and ask you to enter your UPI PIN to receive the money.',
      defense:
        'You NEVER need to enter your UPI PIN or scan a QR code to receive money. A UPI PIN is solely required when money is being deducted from your account.',
    },
  ];

  return (
    <div id="about-safety-page" className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          About CyberShield AI & Cyber Safety Intelligence
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Defensive architecture, AI explainability boundaries, data privacy guarantees, and threat mitigation standards.
        </p>
      </div>

      {/* What the System Does & Methodology */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400">
          <BookOpen className="w-5 h-5" />
          <h3 className="text-base font-bold text-slate-100">
            Methodology & Explainable AI Philosophy
          </h3>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          CyberShield AI is engineered as an <strong>explainable defensive cyber-triage assistant</strong>. Rather than issuing ungrounded categorical proclamations (&ldquo;this is definitely a scam&rdquo;), the engine dissects submitted digital artifacts across five analytical pillars:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-2">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="font-bold text-cyan-300 block">1. Social Engineering Dynamics</span>
            <p className="text-slate-400">Detection of artificial urgency, threats of legal/service loss, manufactured authority, and emotional manipulation.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="font-bold text-emerald-300 block">2. Financial Vector Traps</span>
            <p className="text-slate-400">Identification of advance-fee recruitment, non-reversible UPI VPA demands, and unrealistic guaranteed returns.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="font-bold text-amber-300 block">3. Credential Harvesting</span>
            <p className="text-slate-400">Identification of attempts to solicit OTPs, passwords, Aadhaar, PAN, or KYC verification outside verified banking apps.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="font-bold text-purple-300 block">4. Infrastructure & URL Heuristics</span>
            <p className="text-slate-400">Decomposition of protocol (HTTP vs HTTPS), brand lookalikes, URL shortener redirection chains, and untrusted TLDs.</p>
          </div>
        </div>
      </div>

      {/* Common Indian & Global Threat Playbooks */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5 text-amber-400">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="text-base font-bold text-slate-100">
            Current High-Impact Scam Playbooks
          </h3>
        </div>

        <div className="space-y-3">
          {commonScamPlaybooks.map((playbook, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-slate-200">{playbook.title}</h4>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800">
                  {playbook.modality}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-300">Modus Operandi:</strong> {playbook.modusOperandi}
              </p>
              <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-300 leading-relaxed">
                <strong>Defensive Countermeasure:</strong> {playbook.defense}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy, Ethics & Limitations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-2.5">
          <div className="flex items-center gap-2 text-cyan-400">
            <Lock className="w-4 h-4" />
            <h4 className="text-sm font-bold text-slate-100">Privacy & PII Protection</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            CyberShield AI enforces a strict local-storage architecture. All investigations are persisted locally on your device in your browser. We provide automated client-side PII scrubbing to redact phone numbers and email addresses before submission.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-2.5">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertTriangle className="w-4 h-4" />
            <h4 className="text-sm font-bold text-slate-100">Legal Disclaimers & Limits</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            This tool provides risk indicators based on observable patterns. It cannot subpoena server records or make criminal determinations. Always independently contact your bank or dial <strong>1930</strong> if you suspect financial theft.
          </p>
        </div>
      </div>
    </div>
  );
};
