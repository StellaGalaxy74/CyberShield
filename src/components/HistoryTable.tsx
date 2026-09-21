import React, { useState } from 'react';
import { InvestigationReport, InputModality } from '../types';
import {
  Search,
  Filter,
  Trash2,
  ExternalLink,
  Download,
  AlertCircle,
  PlusCircle,
  FolderOpen,
} from 'lucide-react';
import { RiskBadge } from './RiskBadge';
import { ScamCategoryBadge } from './ScamCategoryBadge';

interface HistoryTableProps {
  reports: InvestigationReport[];
  onOpenReport: (report: InvestigationReport) => void;
  onDeleteReport: (id: string) => void;
  onClearAll: () => void;
  onNewInvestigation: () => void;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({
  reports,
  onOpenReport,
  onDeleteReport,
  onClearAll,
  onNewInvestigation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  // Modal states for user confirmation
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);

  // Derive unique categories
  const allCategories = Array.from(
    new Set(reports.flatMap((r) => r.categories || []))
  ).filter(Boolean);

  const filteredReports = reports.filter((r) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      r.id.toLowerCase().includes(term) ||
      r.summary.toLowerCase().includes(term) ||
      (r.rawInputSnippet && r.rawInputSnippet.toLowerCase().includes(term)) ||
      (r.inputType && r.inputType.toLowerCase().includes(term)) ||
      (r.categories && r.categories.some((c) => c.toLowerCase().includes(term)));

    const matchesRisk = selectedRisk === 'ALL' || r.risk_level === selectedRisk;
    const matchesType = selectedType === 'ALL' || r.inputType === selectedType;

    return matchesSearch && matchesRisk && matchesType;
  });

  const exportAsJson = () => {
    const blob = new Blob([JSON.stringify(reports, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cybershield-investigations-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      onDeleteReport(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  const confirmClearAll = () => {
    onClearAll();
    setShowClearAllModal(false);
  };

  // If zero total reports in storage, show dedicated empty state
  if (reports.length === 0) {
    return (
      <div id="investigation-history-empty" className="p-12 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-5 shadow-xl animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-cyan-950/70 border border-cyan-800 text-cyan-400 flex items-center justify-center mx-auto shadow-inner">
          <FolderOpen className="w-7 h-7" />
        </div>
        <div className="space-y-1.5 max-w-md mx-auto">
          <h3 className="text-xl font-bold text-white">Investigation History</h3>
          <p className="text-sm text-slate-300 font-semibold">No investigations found.</p>
          <p className="text-xs text-slate-400 leading-relaxed pt-1">
            Start analyzing suspicious content to build your investigation history. Saved cases and forensic dossiers will appear here.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={onNewInvestigation}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold inline-flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ New Investigation</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="investigation-history-root" className="space-y-4 animate-fade-in">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID (e.g. INV-2026), type, categories, or keywords..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Risk filter */}
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono-code text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="SUSPICIOUS">Suspicious</option>
            <option value="LOW">Low</option>
          </select>

          {/* Input Type filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Types</option>
            <option value="text">Text</option>
            <option value="url">URL</option>
            <option value="screenshot">Screenshot</option>
            <option value="email">Email</option>
          </select>

          {/* Export JSON button */}
          <button
            onClick={exportAsJson}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
            title="Export full investigation history as JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          {/* Clear All */}
          <button
            onClick={() => setShowClearAllModal(true)}
            className="px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 text-xs font-semibold flex items-center gap-1 transition"
            title="Clear all investigation records"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Reports Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-[11px] font-mono-code text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Investigation ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Input Type</th>
                <th className="py-3 px-4">Scam Category</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredReports.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-slate-800/30 transition group cursor-pointer"
                  onClick={() => onOpenReport(r)}
                >
                  {/* ID */}
                  <td className="py-3.5 px-4 font-mono-code">
                    <span className="font-bold text-cyan-400 group-hover:underline">
                      {r.id}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 font-mono-code text-slate-400 text-[11px] whitespace-nowrap">
                    {new Date(r.timestamp).toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>

                  {/* Input Type */}
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] uppercase font-mono-code px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {r.inputType}
                    </span>
                  </td>

                  {/* Scam Categories */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {r.categories?.slice(0, 2).map((c, i) => (
                        <ScamCategoryBadge key={i} category={c} size="sm" />
                      ))}
                      {r.categories?.length > 2 && (
                        <span className="text-[10px] text-slate-500 self-center">
                          +{r.categories.length - 2}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Risk Score */}
                  <td className="py-3.5 px-4 font-mono-code font-bold text-slate-200">
                    {r.risk_score}/100
                  </td>

                  {/* Risk Level */}
                  <td className="py-3.5 px-4">
                    <RiskBadge level={r.risk_level} size="sm" showIcon={false} />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onOpenReport(r)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition"
                      title="View complete report"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(r.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition"
                      title="Delete investigation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-400">No investigations match your search.</p>
                    <p className="text-xs text-slate-500 mt-1">Try clearing or adjusting your search term or risk filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Single Investigation Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-950/70 border border-rose-800">
                <Trash2 className="w-6 h-6 text-rose-400" />
              </div>
              <h4 className="text-lg font-bold text-white">Delete Investigation?</h4>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              This investigation will be permanently removed from your history and dashboard statistics.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg shadow-rose-600/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Investigations Confirmation Modal */}
      {showClearAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-950/70 border border-rose-800">
                <AlertCircle className="w-6 h-6 text-rose-400" />
              </div>
              <h4 className="text-lg font-bold text-white">Clear All Investigations?</h4>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              This will permanently delete all saved investigation records. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowClearAllModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmClearAll}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg shadow-rose-600/20"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
