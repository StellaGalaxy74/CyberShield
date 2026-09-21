import React from 'react';
import { InvestigationReport } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileText,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ShieldOff,
  PlusCircle,
  Inbox,
} from 'lucide-react';

interface DashboardStatsProps {
  reports: InvestigationReport[];
  onSelectReport: (report: InvestigationReport) => void;
  onNewInvestigation: () => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  reports,
  onSelectReport,
  onNewInvestigation,
}) => {
  const total = reports.length;

  const criticalCount = reports.filter((r) => r.risk_level === 'CRITICAL').length;
  const highCount = reports.filter((r) => r.risk_level === 'HIGH').length;
  const suspiciousCount = reports.filter((r) => r.risk_level === 'SUSPICIOUS').length;
  const lowCount = reports.filter((r) => r.risk_level === 'LOW').length;

  // Most common category
  const categoryCounts: Record<string, number> = {};
  reports.forEach((r) => {
    r.categories?.forEach((cat) => {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
  });

  let topCategory = 'None';
  let topCategoryCount = 0;
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    if (count > topCategoryCount) {
      topCategory = cat;
      topCategoryCount = count;
    }
  });

  // Calculate percentages for Distribution Bar
  const criticalPct = total > 0 ? (criticalCount / total) * 100 : 0;
  const highPct = total > 0 ? (highCount / total) * 100 : 0;
  const suspiciousPct = total > 0 ? (suspiciousCount / total) * 100 : 0;
  const lowPct = total > 0 ? (lowCount / total) * 100 : 0;

  return (
    <div id="cyber-dashboard-root" className="space-y-6 animate-fade-in">
      {/* Metric Cards Grid - Strictly Zero if No Investigations */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Investigations */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Investigations</span>
            <FileText className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-100 font-mono-code">{total}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Saved forensic cases</span>
        </div>

        {/* Critical Risk */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-rose-900/40 shadow-md">
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Critical Risk</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400 font-mono-code">{criticalCount}</div>
          <span className="text-[11px] text-rose-400/70 mt-1 block">Immediate danger cases</span>
        </div>

        {/* High Risk */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-900/40 shadow-md">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">High Risk</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono-code">{highCount}</div>
          <span className="text-[11px] text-amber-400/70 mt-1 block">Elevated scam signatures</span>
        </div>

        {/* Suspicious */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-yellow-900/40 shadow-md">
          <div className="flex items-center justify-between text-yellow-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Suspicious</span>
            <Activity className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="text-3xl font-extrabold text-yellow-400 font-mono-code">{suspiciousCount}</div>
          <span className="text-[11px] text-yellow-400/70 mt-1 block">Anomalous patterns</span>
        </div>

        {/* Low Risk */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-900/40 shadow-md col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Low Risk</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono-code">{lowCount}</div>
          <span className="text-[11px] text-emerald-400/70 mt-1 block">Likely safe cases</span>
        </div>
      </div>

      {/* Main Empty State Hero Banner if zero investigations exist */}
      {total === 0 && (
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-800 text-cyan-400 flex items-center justify-center mx-auto shadow-inner">
            <Inbox className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-white">Your Security Dashboard</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              No investigations yet. Start analyzing suspicious content to build your personal investigation history and risk telemetry.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={onNewInvestigation}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold inline-flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Start Your First Investigation</span>
            </button>
          </div>
        </div>
      )}

      {/* Threat Distribution Visualizer */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Risk Distribution
            </h3>
          </div>
          <div className="text-xs font-mono-code text-slate-400">
            {total > 0 ? (
              <>
                Primary Threat Category: <span className="text-cyan-300 font-bold">{topCategory}</span>
              </>
            ) : (
              <span className="text-slate-500">0 Data Points</span>
            )}
          </div>
        </div>

        {total === 0 ? (
          /* Empty state for Analytics Chart */
          <div className="py-6 text-center space-y-1 text-xs text-slate-500">
            <p className="font-semibold text-slate-400">No investigation data available yet.</p>
            <p>Start your first investigation to see analytics.</p>
          </div>
        ) : (
          /* Segmented Distribution Bar for Real Saved Cases */
          <div className="space-y-3">
            <div className="h-4 w-full rounded-full bg-slate-950 overflow-hidden flex p-0.5 gap-0.5 border border-slate-800">
              {criticalPct > 0 && (
                <div
                  style={{ width: `${criticalPct}%` }}
                  className="h-full bg-rose-500 rounded-l-full transition-all duration-500 hover:opacity-90"
                  title={`Critical: ${criticalCount} (${Math.round(criticalPct)}%)`}
                />
              )}
              {highPct > 0 && (
                <div
                  style={{ width: `${highPct}%` }}
                  className="h-full bg-amber-500 transition-all duration-500 hover:opacity-90"
                  title={`High: ${highCount} (${Math.round(highPct)}%)`}
                />
              )}
              {suspiciousPct > 0 && (
                <div
                  style={{ width: `${suspiciousPct}%` }}
                  className="h-full bg-yellow-400 transition-all duration-500 hover:opacity-90"
                  title={`Suspicious: ${suspiciousCount} (${Math.round(suspiciousPct)}%)`}
                />
              )}
              {lowPct > 0 && (
                <div
                  style={{ width: `${lowPct}%` }}
                  className="h-full bg-emerald-500 rounded-r-full transition-all duration-500 hover:opacity-90"
                  title={`Low: ${lowCount} (${Math.round(lowPct)}%)`}
                />
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono-code pt-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                <span className="text-slate-300">Critical ({criticalCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <span className="text-slate-300">High Risk ({highCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shrink-0" />
                <span className="text-slate-300">Suspicious ({suspiciousCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-slate-300">Low Risk ({lowCount})</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Investigations Quick Cards */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-100">Recent Investigations</h3>
            <p className="text-xs text-slate-400">Investigations performed and saved by you</p>
          </div>

          <button
            onClick={onNewInvestigation}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
          >
            <span>Start Investigation</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {total === 0 ? (
          /* Empty state for Recent Investigations */
          <div className="py-8 text-center space-y-3">
            <p className="text-xs text-slate-400 font-medium">No recent investigations.</p>
            <button
              onClick={onNewInvestigation}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold transition"
            >
              Start Investigation
            </button>
          </div>
        ) : (
          /* List of Real User Saved Investigations */
          <div className="space-y-2.5">
            {reports.slice(0, 5).map((rep) => (
              <div
                key={rep.id}
                onClick={() => onSelectReport(rep)}
                className="p-3.5 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800/90 hover:border-cyan-700/50 cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono-code font-bold text-cyan-400 group-hover:underline">
                      {rep.id}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(rep.timestamp).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="text-[10px] uppercase font-mono-code px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {rep.inputType}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 truncate max-w-xl">
                    {rep.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {rep.categories?.slice(0, 3).map((cat, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Risk readout */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0">
                  <span className="text-sm font-mono-code font-extrabold text-slate-200">
                    {rep.risk_score} / 100
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border font-bold font-mono-code ${
                      rep.risk_level === 'CRITICAL'
                        ? 'bg-rose-950 text-rose-400 border-rose-800'
                        : rep.risk_level === 'HIGH'
                        ? 'bg-amber-950 text-amber-400 border-amber-800'
                        : rep.risk_level === 'SUSPICIOUS'
                        ? 'bg-yellow-950 text-yellow-400 border-yellow-800'
                        : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    }`}
                  >
                    {rep.risk_level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
