import React, { useState, useEffect } from 'react';
import {
  InputModality,
  InvestigationReport,
  DemoSample,
} from './types';
import { investigationService } from './services/investigationService';
import { runClientHeuristicInvestigation } from './services/heuristicAnalyzer';
import { LandingHero } from './components/LandingHero';
import { InvestigationForm } from './components/InvestigationForm';
import { ReportView } from './components/ReportView';
import { DashboardStats } from './components/DashboardStats';
import { HistoryTable } from './components/HistoryTable';
import { AboutSafetyPage } from './components/AboutSafetyPage';
import {
  Shield,
  Search,
  LayoutDashboard,
  History,
  BookOpen,
  Home,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

type PageView = 'landing' | 'investigate' | 'report' | 'dashboard' | 'history' | 'about';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('landing');
  
  // Reports are strictly loaded from the user-driven investigationService (empty initially)
  const [reports, setReports] = useState<InvestigationReport[]>(() =>
    investigationService.getInvestigations()
  );

  const [activeReport, setActiveReport] = useState<InvestigationReport | null>(null);
  const [selectedSample, setSelectedSample] = useState<DemoSample | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Subscribe to persistent storage events
  useEffect(() => {
    const unsubscribe = investigationService.subscribe(() => {
      setReports(investigationService.getInvestigations());
    });
    return unsubscribe;
  }, []);

  // Handle analysis request:
  // Note: Does NOT auto-save. Generates a valid report for the user to review.
  const handleAnalyze = async (payload: {
    type: InputModality;
    content: string;
    imageBase64?: string;
    mimeType?: string;
  }) => {
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      // Allocate the next sequential ID
      const nextId = investigationService.generateInvestigationId();

      let reportData: InvestigationReport | null = null;

      try {
        const response = await fetch('/api/investigate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...payload,
            id: nextId,
          }),
        });

        const contentType = response.headers.get('content-type') || '';
        const rawText = await response.text();

        // Check if response returned valid JSON
        if (response.ok && contentType.includes('application/json')) {
          try {
            reportData = JSON.parse(rawText);
          } catch {
            console.warn('[CyberShield AI] Could not parse server response as JSON.');
          }
        } else if (!response.ok && contentType.includes('application/json')) {
          try {
            const errJson = JSON.parse(rawText);
            console.warn('[CyberShield AI] Server returned error response:', errJson.error);
          } catch {
            // Non-JSON error body
          }
        }
      } catch (fetchErr: any) {
        console.warn('[CyberShield AI] Primary AI analysis endpoint unreachable, engaging local forensic engine:', fetchErr?.message);
      }

      // If backend was temporarily restarting, proxy returned HTML error (502/504),
      // or AI service was unreachable, execute client-side forensic heuristics seamlessly:
      if (!reportData) {
        console.info('[CyberShield AI] Generating forensic assessment using on-device defensive heuristics...');
        reportData = runClientHeuristicInvestigation(payload.type, payload.content, nextId);
      }

      // Display the report in the Report view. Do NOT save to database yet!
      setActiveReport(reportData);
      setCurrentPage('report');
    } catch (err: any) {
      console.error('Investigation error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred during threat inspection.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Explicit user action: Save investigation to history & dashboard
  const handleSaveReport = (report: InvestigationReport) => {
    investigationService.saveInvestigation(report);
  };

  // Delete a saved report
  const handleDeleteReport = (id: string) => {
    investigationService.deleteInvestigation(id);
    if (activeReport?.id === id) {
      setActiveReport(null);
      setCurrentPage('history');
    }
  };

  // Clear all saved reports
  const handleClearAllReports = () => {
    investigationService.deleteAllInvestigations();
    setActiveReport(null);
    setCurrentPage('history');
  };

  // Sample scenario picker: Populates the form without generating fake records
  const handleSelectSample = (sample: DemoSample) => {
    setSelectedSample(sample);
    setCurrentPage('investigate');
  };

  const isCurrentReportSaved = activeReport
    ? investigationService.isInvestigationSaved(activeReport.id)
    : false;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans cyber-grid-bg selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Cybersecurity Command Header */}
      <header className="no-print sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & Tag */}
          <div
            onClick={() => setCurrentPage('landing')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors shadow-sm shadow-cyan-500/20">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-cyan-400 transition">
                  CyberShield
                </span>
                <span className="text-[10px] uppercase font-mono-code font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                  AI DEFENSE
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono-code hidden sm:block">
                Cyber Scam Investigator & Detector
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-1.5 text-xs font-semibold">
            <button
              onClick={() => setCurrentPage('landing')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                currentPage === 'landing'
                  ? 'bg-slate-800 text-cyan-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden md:inline">Home</span>
            </button>

            <button
              onClick={() => {
                setSelectedSample(null);
                setCurrentPage('investigate');
              }}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                currentPage === 'investigate' || currentPage === 'report'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Investigate</span>
            </button>

            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                currentPage === 'dashboard'
                  ? 'bg-slate-800 text-cyan-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentPage('history')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 relative cursor-pointer ${
                currentPage === 'history'
                  ? 'bg-slate-800 text-cyan-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
              {reports.length > 0 && (
                <span className="text-[10px] font-mono-code px-1.5 py-0.2 rounded-full bg-slate-800 text-cyan-400 border border-slate-700">
                  {reports.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentPage('about')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                currentPage === 'about'
                  ? 'bg-slate-800 text-cyan-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden md:inline">About & Safety</span>
            </button>
          </nav>

          {/* Engine Status Tag */}
          <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-800 text-[11px] font-mono-code text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI ENGINE ACTIVE</span>
          </div>
        </div>
      </header>

      {/* Main Container Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Global Error Banner if any */}
        {errorMessage && (
          <div className="no-print mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-600/60 text-xs text-rose-200 flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-slate-400 hover:text-white text-xs underline font-mono-code cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* View Switcher */}
        {currentPage === 'landing' && (
          <LandingHero
            onStartInvestigation={() => {
              setSelectedSample(null);
              setCurrentPage('investigate');
            }}
            onSelectSample={handleSelectSample}
          />
        )}

        {currentPage === 'investigate' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Cyber Threat Investigation Workspace
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                Submit suspicious SMS, WhatsApp messages, payment requests, URLs, or screenshots for explainable AI threat decomposition.
              </p>
            </div>

            <InvestigationForm
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              initialSample={selectedSample}
            />
          </div>
        )}

        {currentPage === 'report' && activeReport && (
          <div className="max-w-5xl mx-auto">
            <ReportView
              report={activeReport}
              isSaved={isCurrentReportSaved}
              onSave={handleSaveReport}
              onDelete={handleDeleteReport}
              onNewScan={() => {
                setActiveReport(null);
                setSelectedSample(null);
                setCurrentPage('investigate');
              }}
            />
          </div>
        )}

        {currentPage === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Cyber Threat Intelligence Dashboard
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Aggregated telemetry, threat spectrum distribution, and user session case audits
                </p>
              </div>
            </div>

            <DashboardStats
              reports={reports}
              onSelectReport={(rep) => {
                setActiveReport(rep);
                setCurrentPage('report');
              }}
              onNewInvestigation={() => {
                setSelectedSample(null);
                setCurrentPage('investigate');
              }}
            />
          </div>
        )}

        {currentPage === 'history' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Investigation Case History
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Inspect previously analyzed scams, filter by risk score, or export structured incident logs
                </p>
              </div>
            </div>

            <HistoryTable
              reports={reports}
              onOpenReport={(rep) => {
                setActiveReport(rep);
                setCurrentPage('report');
              }}
              onDeleteReport={handleDeleteReport}
              onClearAll={handleClearAllReports}
              onNewInvestigation={() => {
                setSelectedSample(null);
                setCurrentPage('investigate');
              }}
            />
          </div>
        )}

        {currentPage === 'about' && <AboutSafetyPage />}
      </main>

      {/* CyberShield Footer */}
      <footer className="no-print border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-300">CyberShield AI</span>
            <span>— Cyber Scam Investigator & Threat Intelligence</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono-code">
            <span>Helpline: <strong className="text-cyan-400">1930</strong></span>
            <span>•</span>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300 transition"
            >
              cybercrime.gov.in
            </a>
            <span>•</span>
            <span>I4C MHA Aligned</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
