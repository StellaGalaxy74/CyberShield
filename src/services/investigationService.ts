import { InvestigationReport, InvestigationStatistics } from '../types';

const STORAGE_KEY = 'cybershield_user_investigations';
const COUNTER_KEY = 'cybershield_investigation_sequence';
const LEGACY_STORAGE_KEY = 'cybershield_reports';

// Mock IDs to explicitly filter out if present from previous sessions
const MOCK_IDS = new Set(['INV-2026-88102', 'INV-2026-41903', 'INV-2026-10923', 'INV-2026-00124']);

/**
 * Service managing user-driven investigation data.
 * Purely local and user-initiated; zero hardcoded pre-populated records.
 */
class InvestigationService {
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.cleanLegacyStorage();
  }

  /**
   * Cleans up any mock data from previous sessions or legacy storage keys.
   */
  private cleanLegacyStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      // Remove legacy storage if it exists
      if (localStorage.getItem(LEGACY_STORAGE_KEY)) {
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }

      // Check current storage and strip any mock IDs
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: InvestigationReport[] = JSON.parse(raw);
        const filtered = parsed.filter((r) => !MOCK_IDS.has(r.id));
        if (filtered.length !== parsed.length) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        }
      }
    } catch {
      // Storage unavailable or corrupted; continue silently
    }
  }

  /**
   * Subscribe to changes in the investigation store.
   */
  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (e) {
        console.error('Error in investigation store listener', e);
      }
    });
  }

  /**
   * Generates the next sequential Investigation ID in format INV-YYYY-00001
   */
  public generateInvestigationId(): string {
    const year = new Date().getFullYear();
    let counter = 1;

    try {
      const storedCounter = localStorage.getItem(COUNTER_KEY);
      if (storedCounter) {
        const parsed = parseInt(storedCounter, 10);
        if (!isNaN(parsed) && parsed > 0) {
          counter = parsed + 1;
        }
      }
      localStorage.setItem(COUNTER_KEY, counter.toString());
    } catch {
      // Fallback in case of storage restriction
      counter = Math.floor(10000 + Math.random() * 90000);
    }

    const paddedSequence = String(counter).padStart(5, '0');
    return `INV-${year}-${paddedSequence}`;
  }

  /**
   * Retrieve all saved user investigations.
   * Returns empty array if none saved.
   */
  public getInvestigations(): InvestigationReport[] {
    if (typeof window === 'undefined') return [];

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const reports: InvestigationReport[] = JSON.parse(raw);
      return Array.isArray(reports)
        ? reports.filter((r) => r && r.id && !MOCK_IDS.has(r.id))
        : [];
    } catch (e) {
      console.warn('Failed to parse investigations from localStorage:', e);
      return [];
    }
  }

  /**
   * Retrieve single investigation by ID.
   */
  public getInvestigationById(id: string): InvestigationReport | undefined {
    return this.getInvestigations().find((r) => r.id === id);
  }

  /**
   * Check if an investigation ID is already saved in history.
   */
  public isInvestigationSaved(id: string): boolean {
    if (!id) return false;
    return this.getInvestigations().some((r) => r.id === id);
  }

  /**
   * Save a newly generated or updated investigation to user history.
   */
  public saveInvestigation(report: InvestigationReport): InvestigationReport {
    if (!report || !report.id) {
      throw new Error('Cannot save an invalid investigation report');
    }

    const current = this.getInvestigations();
    const existingIndex = current.findIndex((r) => r.id === report.id);

    let updated: InvestigationReport[];
    if (existingIndex >= 0) {
      // Update existing record
      updated = [...current];
      updated[existingIndex] = report;
    } else {
      // Prepend newly saved report (newest first)
      updated = [report, ...current];
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save investigation to localStorage:', e);
    }

    this.notify();
    return report;
  }

  /**
   * Delete an individual investigation from history.
   */
  public deleteInvestigation(id: string): boolean {
    const current = this.getInvestigations();
    const filtered = current.filter((r) => r.id !== id);

    if (filtered.length === current.length) {
      return false; // Not found
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to delete investigation from localStorage:', e);
    }

    this.notify();
    return true;
  }

  /**
   * Delete all saved investigations (resets history and stats to 0).
   */
  public deleteAllInvestigations(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear investigations from localStorage:', e);
    }

    this.notify();
  }

  /**
   * Compute dynamic statistics derived strictly from saved user investigations.
   */
  public getInvestigationStatistics(): InvestigationStatistics {
    const investigations = this.getInvestigations();

    let critical = 0;
    let high = 0;
    let suspicious = 0;
    let low = 0;
    const categoryMap: Record<string, number> = {};

    for (const inv of investigations) {
      switch (inv.risk_level) {
        case 'CRITICAL':
          critical++;
          break;
        case 'HIGH':
          high++;
          break;
        case 'SUSPICIOUS':
          suspicious++;
          break;
        case 'LOW':
        default:
          low++;
          break;
      }

      if (Array.isArray(inv.categories)) {
        for (const cat of inv.categories) {
          if (cat) {
            categoryMap[cat] = (categoryMap[cat] || 0) + 1;
          }
        }
      }
    }

    let topCategory = 'None';
    let topCategoryCount = 0;
    for (const [cat, count] of Object.entries(categoryMap)) {
      if (count > topCategoryCount) {
        topCategory = cat;
        topCategoryCount = count;
      }
    }

    return {
      total: investigations.length,
      critical,
      high,
      suspicious,
      low,
      categories: categoryMap,
      topCategory,
      topCategoryCount,
    };
  }
}

export const investigationService = new InvestigationService();
