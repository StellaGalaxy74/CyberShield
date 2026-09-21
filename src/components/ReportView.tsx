import React, { useState } from 'react';
import { InvestigationReport } from '../types';
import { downloadReportPdf } from '../services/pdfGenerator';
import { RiskScore } from './RiskScore';
import { RiskBadge } from './RiskBadge';
import { ScamCategoryBadge } from './ScamCategoryBadge';
import { RedFlagCard } from './RedFlagCard';
import { EvidencePanel } from './EvidencePanel';
import { UrlInspector } from './UrlInspector';
import { InvestigationTimeline } from './InvestigationTimeline';
import { RecommendationCard } from './RecommendationCard';
import {
  ShieldAlert,
  Download,
  Copy,
  Check,
  RotateCcw,
  AlertTriangle,
  Info,
  Calendar,
  Share2,
  ChevronRight,
  ShieldCheck,
  BookmarkPlus,
  BookmarkCheck,
  Trash2,
  AlertCircle,
} from 'lucide-react';

interface ReportViewProps {
  report: InvestigationReport;
  onNewScan: () => void;
  isSaved?: boolean;
  onSave?: (report: InvestigationReport) => void;
  onDelete?: (id: string) => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  report,
  onNewScan,
  isSaved = false,
  onSave,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [justSavedNotice, setJustSavedNotice] = useState(false);

  const isOtpOrKyc =
    report.categories?.some((c) =>
      c.toLowerCase().includes('kyc') ||
      c.toLowerCase().includes('otp') ||
      c.toLowerCase().includes('phish') ||
      c.toLowerCase().includes('payment')
    ) || report.red_flags?.some((f) => f.indicator.toLowerCase().includes('credential') || f.indicator.toLowerCase().includes('otp'));

  const handleCopySummary = () => {
    const text = `
[CYBERSHIELD AI INVESTIGATION REPORT]
ID: ${report.id}
Risk Score: ${report.risk_score}/100 (${report.risk_level})
Categories: ${report.categories.join(', ')}
Summary: ${report.summary}

WHY THIS WAS FLAGGED:
${report.reasoning_points.map((pt, i) => `${i + 1}. ${pt}`).join('\n')}

SAFETY RECOMMENDATIONS:
${report.recommended_actions.map((act) => `• ${act}`).join('\n')}

Official India Cybercrime Helpline: 1930 | cybercrime.gov.in
`.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const handleDownloadPdf = () => {
    setIsExportingPdf(true);
    try {
      downloadReportPdf(report);
    } catch (err) {
      console.error('[CyberShield AI] Failed to generate PDF dossier:', err);
    } finally {
      setTimeout(() => setIsExportingPdf(false), 1200);
    }
  };

  const handleSaveClick = () => {
    if (onSave) {
      onSave(report);
      setJustSavedNotice(true);
      setTimeout(() => setJustSavedNotice(false), 3000);
    }
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(report.id);
      setShowDeleteModal(false);
    }
  };

  return (
    <div id="investigation-report-view" className="space-y-6 animate-fade-in">
      {/* Print-Only Official Dossier Letterhead Header */}
      <div className="print-only border-b-2 border-slate-900 pb-4 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                CYBERSHIELD AI DEFENSE
              </span>
              <span className="text-[11px] uppercase font-mono font-bold px-2 py-0.5 border border-slate-800 text-slate-900 rounded">
                Official Incident Dossier
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Cyber Scam & Threat Forensic Investigation Report
            </p>
            <p className="text-[11px] text-slate-600 font-mono mt-0.5">
              Standards: Indian Cyber Crime Coordination Centre (I4C) | Helpline 1930 | cybercrime.gov.in
            </p>
          </div>

          <div className="text-right font-mono text-xs text-slate-800 space-y-1">
            <div>
              <span className="text-slate-500">Dossier ID: </span>
              <strong className="font-bold text-slate-950">{report.id}</strong>
            </div>
            <div>
              <span className="text-slate-500">Date: </span>
              <span>{new Date(report.timestamp).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500">Modality: </span>
              <span className="uppercase font-semibold">{report.inputType}</span>
            </div>
            <div>
              <span className="text-slate-500">Risk Assessment: </span>
              <strong className="font-bold text-slate-950">
                {report.risk_level} ({report.risk_score}/100)
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Top Report Status Bar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-800 text-cyan-400 font-mono-code font-bold text-xs">
            {report.id}
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono-code">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {new Date(report.timestamp).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </span>
          </div>

          {/* Saved Status Indicator */}
          {isSaved ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950 text-emerald-400 border border-emerald-800">
              <BookmarkCheck className="w-3 h-3" />
              <span>Saved in History</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-950/70 text-amber-400 border border-amber-800/60">
              <span>Unsaved Case</span>
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Primary Save Investigation Button */}
          {!isSaved && onSave && (
            <button
              id="report-save-btn"
              onClick={handleSaveClick}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-700/20 transition cursor-pointer"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>Save Investigation</span>
            </button>
          )}

          {isSaved && onDelete && (
            <button
              id="report-delete-btn"
              onClick={() => setShowDeleteModal(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/80 border border-slate-700 hover:border-rose-700/50 text-slate-300 hover:text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Delete this saved investigation"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          )}

          <button
            id="report-copy-summary-btn"
            onClick={handleCopySummary}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="Copy structured investigation summary"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          {/* Dedicated Download PDF Dossier Button */}
          <button
            id="report-download-pdf-btn"
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="no-print px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-emerald-200 border border-slate-700 hover:border-emerald-500/50 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer disabled:opacity-50"
            title="Download official forensic dossier as PDF file"
          >
            {isExportingPdf ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Exporting PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Download PDF</span>
              </>
            )}
          </button>

          <button
            id="report-new-scan-btn"
            onClick={onNewScan}
            className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-950" />
            <span>Start New Investigation</span>
          </button>
        </div>
      </div>

      {/* Unsaved Reminder Alert */}
      {!isSaved && (
        <div className="no-print p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-amber-200">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              This report has not been saved yet. Click <strong>Save Investigation</strong> if you wish to record it in your history and dashboard metrics.
            </span>
          </div>
          {onSave && (
            <button
              onClick={handleSaveClick}
              className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shrink-0 transition cursor-pointer"
            >
              Save Now
            </button>
          )}
        </div>
      )}

      {justSavedNotice && (
        <div className="no-print p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 flex items-center gap-2.5 text-xs text-emerald-200 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Investigation successfully saved to your history and dashboard statistics!</span>
        </div>
      )}

      {/* Primary Threat Evaluation Meter */}
      <RiskScore
        score={report.risk_score}
        level={report.risk_level}
        confidence={report.confidence}
        explanation={report.summary}
      />

      {/* Category Badges & Executive Brief */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <span className="text-xs uppercase font-mono-code font-bold tracking-wider text-slate-400">
            Identified Threat Vectors & Taxonomy
          </span>
          <div className="flex flex-wrap gap-1.5">
            {report.categories?.map((cat, i) => (
              <ScamCategoryBadge key={i} category={cat} />
            ))}
          </div>
        </div>

        {/* Executive Summary Narrative */}
        <div className="space-y-1">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Executive Forensic Summary:
          </span>
          <p className="text-sm text-slate-200 leading-relaxed">
            {report.summary}
          </p>
        </div>
      </div>

      {/* Investigation Reasoning: "Why this was flagged" */}
      {report.reasoning_points && report.reasoning_points.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Forensic Reasoning & Diagnostic Points
            </h3>
          </div>

          <ul className="space-y-2.5 text-sm text-slate-300">
            {report.reasoning_points.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono-code flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Red Flags Grid */}
      {report.red_flags && report.red_flags.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Detected Red Flags ({report.red_flags.length})</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {report.red_flags.map((flag, index) => (
              <RedFlagCard key={index} redFlag={flag} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Extracted Evidence & Entities */}
      <EvidencePanel
        entities={report.entities}
        rawSnippet={report.rawInputSnippet}
        ocrText={report.extractedContentText}
      />

      {/* URL Forensic Deep-Dive if available */}
      {report.url_inspection && (
        <UrlInspector inspection={report.url_inspection} />
      )}

      {/* Investigation Sequence Timeline if available */}
      {report.timeline && report.timeline.length > 0 && (
        <InvestigationTimeline timeline={report.timeline} />
      )}

      {/* Recommendations & India Jurisdiction Guidance */}
      <RecommendationCard
        recommendations={report.recommended_actions}
        indiaGuidance={report.india_guidance}
        isOtpOrKycRisk={isOtpOrKyc}
      />

      {/* Investigation Limitations / Disclaimers */}
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-300">
          <Info className="w-4 h-4 text-cyan-400" />
          <span>Investigation Limitations & Analytical Boundaries</span>
        </div>
        <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-slate-400 leading-relaxed">
          {report.limitations?.map((lim, i) => (
            <li key={i}>{lim}</li>
          ))}
          <li>
            This investigation is an AI-assisted risk evaluation based on observable textual and structural indicators. CyberShield AI does not replace certified legal or law enforcement forensic audits.
          </li>
        </ul>
      </div>

      {/* Bottom Actions Bar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="text-xs text-slate-400">
          {isSaved ? 'Case recorded in your personal database.' : 'Unsaved investigation. Save to preserve in history.'}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Download PDF button at bottom */}
          <button
            id="report-bottom-download-pdf-btn"
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="no-print px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-emerald-200 border border-slate-700 hover:border-emerald-500/50 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer disabled:opacity-50"
            title="Download official forensic dossier as PDF file"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download PDF</span>
          </button>

          {!isSaved && onSave && (
            <button
              id="report-bottom-save-btn"
              onClick={handleSaveClick}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <BookmarkPlus className="w-4 h-4" />
              <span>Save Investigation</span>
            </button>
          )}

          <button
            id="report-bottom-new-scan-btn"
            onClick={onNewScan}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-950" />
            <span>Start New Investigation</span>
          </button>
        </div>
      </div>

      {/* Print-Only Official Dossier Footer */}
      <div className="print-only border-t-2 border-slate-900 pt-4 mt-8 text-xs text-slate-700">
        <div className="flex justify-between items-center text-[10px] font-mono">
          <div>
            <strong>CYBERSHIELD AI FORENSIC THREAT DOSSIER • CASE #{report.id}</strong>
          </div>
          <div>
            Official Reporting: <strong>cybercrime.gov.in</strong> | Emergency Helpline: <strong>1930</strong>
          </div>
        </div>
        <p className="text-[9px] text-slate-500 mt-1 leading-relaxed">
          Confidentiality & Compliance Notice: This investigation report was produced using automated multi-modal forensic heuristics aligned with the Indian Cyber Crime Coordination Centre (I4C) taxonomy. This document can be exported as a PDF or printed for preservation and physical complaint filing at your local cyber police station or cybercrime.gov.in.
        </p>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-950/70 border border-rose-800">
                <Trash2 className="w-6 h-6 text-rose-400" />
              </div>
              <h4 className="text-lg font-bold text-white">Delete Investigation?</h4>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              This investigation (<span className="font-mono-code font-bold text-cyan-400">{report.id}</span>) will be permanently removed from your history and dashboard statistics.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg shadow-rose-600/20"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
