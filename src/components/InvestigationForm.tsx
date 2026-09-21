import React, { useState, useRef } from 'react';
import { InputModality, DemoSample } from '../types';
import { DEMO_SAMPLES } from '../data/demoSamples';
import {
  MessageSquare,
  Globe,
  Image as ImageIcon,
  Mail,
  ShieldCheck,
  Zap,
  RotateCcw,
  Sparkles,
  Upload,
  AlertTriangle,
  Lock,
  X,
} from 'lucide-react';

interface InvestigationFormProps {
  onAnalyze: (payload: {
    type: InputModality;
    content: string;
    imageBase64?: string;
    mimeType?: string;
  }) => void;
  isAnalyzing: boolean;
  initialSample?: DemoSample | null;
}

export const InvestigationForm: React.FC<InvestigationFormProps> = ({
  onAnalyze,
  isAnalyzing,
  initialSample,
}) => {
  const [activeTab, setActiveTab] = useState<InputModality>('text');
  const [textContent, setTextContent] = useState('');
  const [urlContent, setUrlContent] = useState('');
  const [emailContent, setEmailContent] = useState({
    sender: '',
    subject: '',
    body: '',
  });

  // Screenshot handling
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>('image/png');
  const [screenshotNote, setScreenshotNote] = useState('');

  // Client-side PII scrubbing toggle
  const [scrubPii, setScrubPii] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync initial sample if passed
  React.useEffect(() => {
    if (initialSample) {
      loadSample(initialSample);
    }
  }, [initialSample]);

  const handleTabChange = (tab: InputModality) => {
    setActiveTab(tab);
  };

  const handleImageUpload = (file: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit. Please upload an optimized screenshot.');
      return;
    }

    setImageMime(file.type || 'image/png');
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setImageBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const loadSample = (sample: DemoSample) => {
    setActiveTab(sample.type);
    if (sample.type === 'text') {
      setTextContent(sample.content);
    } else if (sample.type === 'url') {
      setUrlContent(sample.content);
    } else if (sample.type === 'screenshot') {
      setTextContent(sample.content);
      setScreenshotNote('Sample WhatsApp customs extortion message loaded.');
    }
  };

  const handleClear = () => {
    setTextContent('');
    setUrlContent('');
    setEmailContent({ sender: '', subject: '', body: '' });
    setImagePreview(null);
    setImageBase64(null);
    setScreenshotNote('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnalyzing) return;

    let finalContent = '';
    let imgData: string | undefined = undefined;

    if (activeTab === 'text') {
      finalContent = textContent.trim();
    } else if (activeTab === 'url') {
      finalContent = urlContent.trim();
    } else if (activeTab === 'email') {
      finalContent = `From: ${emailContent.sender}\nSubject: ${emailContent.subject}\n\n${emailContent.body}`.trim();
    } else if (activeTab === 'screenshot') {
      finalContent = screenshotNote.trim() || 'Uploaded screenshot for OCR and cyber fraud investigation.';
      imgData = imageBase64 || undefined;
    }

    if (!finalContent && !imgData) {
      alert('Please enter text, URL, or upload a screenshot to investigate.');
      return;
    }

    // Optional client-side redaction of PII before transmission
    if (scrubPii && finalContent) {
      finalContent = finalContent
        .replace(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '[PHONE REDACTED]')
        .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL REDACTED]');
    }

    onAnalyze({
      type: activeTab,
      content: finalContent,
      imageBase64: imgData,
      mimeType: imageMime,
    });
  };

  return (
    <div className="space-y-4">
      {/* Pre-flight Privacy & Safety Notice */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex items-center justify-between gap-3 text-slate-300">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong>Privacy Guarantee:</strong> Defensive indicator scanning only. Never submit passwords, active OTPs, or CVVs.
          </span>
        </div>
        <label className="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-slate-200 select-none shrink-0 font-mono-code text-[11px]">
          <input
            type="checkbox"
            checked={scrubPii}
            onChange={(e) => setScrubPii(e.target.checked)}
            className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
          />
          <span>Auto-Redact Phone & Email</span>
        </label>
      </div>

      {/* Main Workspace Card */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl p-6 backdrop-blur-md">
        {/* Modality Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4 mb-5">
          <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800">
            <button
              type="button"
              onClick={() => handleTabChange('text')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'text'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Analyze Text / SMS</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('url')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'url'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Analyze URL</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('screenshot')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'screenshot'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Analyze Screenshot</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('email')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'email'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Analyze Email</span>
            </button>
          </div>

          {/* Quick Demo Case Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Try Demo:</span>
            <select
              onChange={(e) => {
                const s = DEMO_SAMPLES.find((d) => d.id === e.target.value);
                if (s) loadSample(s);
              }}
              defaultValue=""
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono-code text-cyan-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="" disabled>
                Select Safe Sample Case...
              </option>
              {DEMO_SAMPLES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label} ({s.expectedRisk})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Text / SMS / Chat Tab */}
          {activeTab === 'text' && (
            <div className="space-y-2">
              <label className="block text-xs font-mono-code text-slate-300 uppercase tracking-wider">
                Paste Suspicious Message, SMS, WhatsApp, or Job/Investment Pitch:
              </label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Example: 'URGENT: Your bank account will be suspended today. Verify your KYC immediately using this link http://...'"
                rows={6}
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono-code leading-relaxed resize-y"
              />
              <div className="flex justify-between items-center text-[11px] text-slate-500">
                <span>Accepts WhatsApp chats, SMS alerts, social DMs, and Telegram messages</span>
                <span>{textContent.length} characters</span>
              </div>
            </div>
          )}

          {/* URL Tab */}
          {activeTab === 'url' && (
            <div className="space-y-2">
              <label className="block text-xs font-mono-code text-slate-300 uppercase tracking-wider">
                Enter Suspicious Website or Shortened Link to Deconstruct:
              </label>
              <div className="relative">
                <Globe className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={urlContent}
                  onChange={(e) => setUrlContent(e.target.value)}
                  placeholder="https://sbi-kyc-verification.online/login or bit.ly/claim-prize"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono-code text-cyan-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                CyberShield analyzes domain structure, subdomains, TLD reputation, punycode lookalikes, and query parameters without triggering malicious client scripts.
              </p>
            </div>
          )}

          {/* Screenshot Upload Tab */}
          {activeTab === 'screenshot' && (
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
              />

              {!imagePreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files?.[0]) handleImageUpload(e.dataTransfer.files[0]);
                  }}
                  className="p-8 border-2 border-dashed border-slate-800 hover:border-cyan-500/70 rounded-2xl bg-slate-950/60 hover:bg-slate-950 cursor-pointer transition flex flex-col items-center justify-center text-center space-y-3 group"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-900 group-hover:bg-cyan-950/60 text-slate-400 group-hover:text-cyan-400 flex items-center justify-center transition">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-200 block">
                      Click to upload or drag and drop screenshot
                    </span>
                    <span className="text-xs text-slate-500 block mt-1">
                      PNG, JPG, or WebP (Payment proofs, fake KYC chats, UPI apps, QR codes)
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-code text-cyan-400 font-semibold">
                      Uploaded Screenshot Ready for Multimodal Vision OCR:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageBase64(null);
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-400 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="max-h-64 overflow-hidden rounded-lg border border-slate-800 flex justify-center bg-slate-900">
                    <img
                      src={imagePreview}
                      alt="Uploaded forensic sample"
                      className="max-h-64 object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <input
                    type="text"
                    value={screenshotNote}
                    onChange={(e) => setScreenshotNote(e.target.value)}
                    placeholder="Optional context (e.g., 'Received on WhatsApp from unknown number claiming to be bank manager')"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}
            </div>
          )}

          {/* Email Tab */}
          {activeTab === 'email' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-code text-slate-300 uppercase tracking-wider mb-1">
                    Sender Header (From):
                  </label>
                  <input
                    type="text"
                    value={emailContent.sender}
                    onChange={(e) => setEmailContent({ ...emailContent, sender: e.target.value })}
                    placeholder="e.g. security-alert@sbi-updates-bank.net or support@paytm.xyz"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono-code text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-slate-300 uppercase tracking-wider mb-1">
                    Subject Line:
                  </label>
                  <input
                    type="text"
                    value={emailContent.subject}
                    onChange={(e) => setEmailContent({ ...emailContent, subject: e.target.value })}
                    placeholder="e.g. Action Required: Immediate suspension of account services"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-code text-slate-300 uppercase tracking-wider mb-1">
                  Email Body Content:
                </label>
                <textarea
                  value={emailContent.body}
                  onChange={(e) => setEmailContent({ ...emailContent, body: e.target.value })}
                  placeholder="Paste the full email message text and any links here..."
                  rows={4}
                  className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono-code"
                />
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition disabled:opacity-50 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Investigating Threat Indicators...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Analyze with CyberShield AI</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
