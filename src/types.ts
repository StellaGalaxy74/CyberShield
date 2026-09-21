/**
 * CyberShield AI — Type Definitions
 */

export type RiskLevel = 'LOW' | 'SUSPICIOUS' | 'HIGH' | 'CRITICAL';

export type InputModality = 'text' | 'url' | 'screenshot' | 'email';

export type ScamCategory =
  | 'Phishing'
  | 'Smishing'
  | 'Vishing'
  | 'Financial fraud'
  | 'UPI/payment scam'
  | 'Investment scam'
  | 'Job scam'
  | 'Romance scam'
  | 'Impersonation'
  | 'Account takeover'
  | 'Tech-support scam'
  | 'Shopping scam'
  | 'Lottery/prize scam'
  | 'Cryptocurrency scam'
  | 'Identity theft'
  | 'KYC fraud'
  | 'Digital arrest / Extortion'
  | 'Other';

export interface RedFlag {
  indicator: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  evidence: string;
  explanation: string;
  category?: string;
}

export interface ExtractedEntities {
  urls: string[];
  phone_numbers: string[];
  emails: string[];
  payment_identifiers: string[]; // UPI IDs, VPA, Bank accounts
  organizations: string[];
  suspicious_keywords: string[];
}

export interface TimelineEvent {
  timeOrStep: string;
  action: string;
  riskEscalation: 'NORMAL' | 'ELEVATED' | 'CRITICAL';
  description?: string;
}

export interface UrlInspectionDetails {
  analyzedUrl: string;
  protocol: 'https' | 'http' | 'other';
  domain: string;
  subdomain?: string;
  tld: string;
  isShortener: boolean;
  isLookalike: boolean;
  hasSuspiciousParams: boolean;
  hasIpAddress: boolean;
  observedEvidence: string[];
  aiInference: string[];
  unverifiedAspects: string[];
}

export interface IndiaGuidance {
  applicable: boolean;
  reportingAuthority: string;
  helpline: string;
  portalUrl: string;
  immediateSteps: string[];
  upiOrBankingAction?: string;
}

export interface InvestigationReport {
  id: string;
  timestamp: string;
  inputType: InputModality;
  rawInputSnippet: string;
  extractedContentText?: string; // OCR text if screenshot
  
  risk_score: number; // 0 to 100
  risk_level: RiskLevel;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  categories: string[];
  summary: string;
  
  reasoning_points: string[]; // "Why this was flagged"
  red_flags: RedFlag[];
  entities: ExtractedEntities;
  timeline?: TimelineEvent[];
  url_inspection?: UrlInspectionDetails;
  
  recommended_actions: string[];
  india_guidance: IndiaGuidance;
  limitations: string[];
}

export interface InvestigationStatistics {
  total: number;
  critical: number;
  high: number;
  suspicious: number;
  low: number;
  categories: Record<string, number>;
  topCategory: string;
  topCategoryCount: number;
}

export interface InvestigationHistoryItem {
  id: string;
  date: string;
  inputType: InputModality;
  categories: string[];
  risk_score: number;
  risk_level: RiskLevel;
  short_summary: string;
  fullReport: InvestigationReport;
}

export interface DemoSample {
  id: string;
  title: string;
  type: InputModality;
  label: string;
  description: string;
  content: string;
  expectedScore: number;
  expectedRisk: RiskLevel;
}
