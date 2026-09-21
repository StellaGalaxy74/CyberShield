import { InvestigationReport, InputModality } from '../types';

/**
 * Client-side Heuristic Threat Analysis Engine for CyberShield AI.
 * Provides resilient, instantaneous forensic analysis if the backend
 * AI service is restarting, rate-limited, offline, or returns a proxy timeout.
 */
export function runClientHeuristicInvestigation(
  type: InputModality,
  content: string,
  customId?: string
): InvestigationReport {
  const lower = (content || '').toLowerCase();
  const redFlags: any[] = [];
  const categories: string[] = [];
  let score = 15;

  const entities: any = {
    urls: [],
    phone_numbers: [],
    emails: [],
    payment_identifiers: [],
    organizations: [],
    suspicious_keywords: [],
  };

  // Extract URLs
  const urlMatches = content.match(/https?:\/\/[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}[^\s]*/g);
  if (urlMatches) {
    entities.urls = Array.from(new Set(urlMatches));
  }

  // Extract phone numbers (international / indian)
  const phoneMatches = content.match(/(?:\+?\d{1,3}[-\s.]?)?\(?\d{2,4}\)?[-\s.]?\d{3,5}[-\s.]?\d{4}/g);
  if (phoneMatches) {
    entities.phone_numbers = Array.from(new Set(phoneMatches));
  }

  // Extract emails
  const emailMatches = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
  if (emailMatches) {
    entities.emails = Array.from(new Set(emailMatches));
  }

  // Extract UPI handles
  const upiMatches = content.match(/[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/g);
  if (upiMatches) {
    entities.payment_identifiers = Array.from(new Set(upiMatches));
  }

  // Heuristic checks
  if (/urgent|immediate|within\s*\d+\s*(mins|minutes|hours)|today|block|suspend|deactivat|tonight/i.test(lower)) {
    score += 25;
    entities.suspicious_keywords.push('urgent', 'immediate', 'deactivation');
    redFlags.push({
      indicator: 'Urgency Manipulation & Threat of Service Interruption',
      severity: 'HIGH',
      evidence: content.slice(0, 120),
      explanation: 'Pressures the recipient to act impulsively without verifying through official channels.',
    });
  }

  if (/otp|pin|cvv|password|aadhaar|pan\s*card|kyc|verify\s*account|update\s*kyc/i.test(lower)) {
    score += 30;
    categories.push('KYC fraud', 'Identity theft');
    entities.suspicious_keywords.push('OTP', 'KYC', 'verification');
    redFlags.push({
      indicator: 'Credential & Identity Harvesting Demand',
      severity: 'CRITICAL',
      evidence: 'References to OTP, PIN, or mandatory KYC verification detected.',
      explanation: 'Legitimate organizations and banks never solicit confidential authentication credentials or OTPs via unverified messages.',
    });
  }

  if (/work\s*from\s*home|part\s*time\s*job|registration\s*fee|telegram\s*task|earn\s*₹|daily\s*income|like\s*youtube/i.test(lower)) {
    score += 30;
    categories.push('Job scam');
    entities.suspicious_keywords.push('part-time job', 'daily income');
    redFlags.push({
      indicator: 'Advance-Fee Recruitment Pattern',
      severity: 'HIGH',
      evidence: 'Unrealistic pay rates coupled with upfront registration or task requirements.',
      explanation: 'Genuine employers do not charge onboarding or training fees to offer employment.',
    });
  }

  if (/guaranteed|300%|crypto|trading\s*bonus|double\s*your\s*money|investment\s*slot|free\s*gift/i.test(lower)) {
    score += 30;
    categories.push('Investment scam');
    entities.suspicious_keywords.push('guaranteed returns', 'investment slot');
    redFlags.push({
      indicator: 'Unrealistic Guaranteed Return Claim',
      severity: 'CRITICAL',
      evidence: 'Promising guaranteed or exponential returns over short time horizons.',
      explanation: 'Classic hallmark of Ponzi schemes, fake stock tips, and unregulated fraudulent trading platforms.',
    });
  }

  if (entities.urls.length > 0) {
    score += 15;
    if (!categories.includes('Phishing')) categories.push('Phishing');
    redFlags.push({
      indicator: 'External Hyperlink in High-Stakes Context',
      severity: 'MEDIUM',
      evidence: entities.urls.join(', '),
      explanation: 'Directs user to an unverified external destination instead of an official application or verified domain.',
    });
  }

  if (/customs|parcel|fedex|dhl|arrest|police|cbi|ed\s*notice|narcotics/i.test(lower)) {
    score += 35;
    categories.push('Digital Arrest / Impersonation scam');
    entities.suspicious_keywords.push('customs', 'arrest warrant');
    redFlags.push({
      indicator: 'Law Enforcement & Government Impersonation',
      severity: 'CRITICAL',
      evidence: 'Claims of illegal parcels, arrest warrants, or fake law enforcement authority.',
      explanation: 'Law enforcement agencies never conduct interrogation or issue summons via Skype or WhatsApp.',
    });
  }

  // Detect brand impersonation
  const brands = ['sbi', 'hdfc', 'icici', 'axis', 'paytm', 'phonepe', 'gpay', 'netflix', 'amazon', 'electricity'];
  for (const b of brands) {
    if (lower.includes(b)) {
      entities.organizations.push(b.toUpperCase());
    }
  }

  if (categories.length === 0) {
    if (score > 40) categories.push('Social engineering');
    else categories.push('Suspicious communication');
  }

  score = Math.min(Math.max(score, 12), 96);
  let riskLevel: 'LOW' | 'SUSPICIOUS' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (score >= 80) riskLevel = 'CRITICAL';
  else if (score >= 55) riskLevel = 'HIGH';
  else if (score >= 26) riskLevel = 'SUSPICIOUS';

  const invId = customId || `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

  return {
    id: invId,
    timestamp: new Date().toISOString(),
    inputType: type,
    rawInputSnippet: content.slice(0, 300),
    extractedContentText: content || 'Analyzed content',
    risk_score: score,
    risk_level: riskLevel,
    confidence: 'HIGH',
    categories,
    summary:
      score > 50
        ? 'The submitted communication exhibits multiple high-probability scam signatures, including artificial urgency, credential verification prompts, and unverified contact channels.'
        : 'Low-to-moderate indicator density observed. Standard defensive verification recommended before taking any action.',
    reasoning_points: [
      'Observed content employs psychological pressure or promise of outsized incentives.',
      'Communication vector bypasses standard verified organizational banking or corporate portals.',
      'The combination of credential requests or urgent action links aligns closely with known fraud campaigns.',
    ],
    red_flags: redFlags,
    entities,
    timeline: [
      {
        timeOrStep: 'Step 1: Contact',
        action: 'Unsolicited digital communication received by target',
        riskEscalation: 'NORMAL',
        description: 'Initial message claims urgency, reward, or threatening service disruption.',
      },
      {
        timeOrStep: 'Step 2: Coercion',
        action: 'Pressure to bypass standard safety verification',
        riskEscalation: 'ELEVATED',
        description: 'Directs target to click external link, call unverified number, or transfer funds.',
      },
      {
        timeOrStep: 'Step 3: Exploitation',
        action: 'Attempted extraction of credentials, funds, or OTP',
        riskEscalation: 'CRITICAL',
        description: 'Risk reaches peak threshold as credentials or financial transactions are solicited.',
      },
    ],
    url_inspection:
      entities.urls.length > 0
        ? {
            analyzedUrl: entities.urls[0],
            protocol: entities.urls[0].startsWith('https') ? 'https' : 'http',
            domain: entities.urls[0].replace(/^https?:\/\//, '').split('/')[0],
            tld: entities.urls[0].split('.').pop()?.split('/')[0] || 'unknown',
            isShortener: /(bit\.ly|tinyurl|t\.co|is\.gd|cutt\.ly)/i.test(entities.urls[0]),
            isLookalike: /sbi|hdfc|icici|amazon|netflix|gov|kyc|support/i.test(entities.urls[0]),
            hasSuspiciousParams: entities.urls[0].includes('?'),
            hasIpAddress: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/.test(entities.urls[0]),
            observedEvidence: ['External destination link provided in unsolicited communication.'],
            aiInference: ['High likelihood of credential harvesting page or redirection chain.'],
            unverifiedAspects: ['Hosting server WHOIS registration records and ASN ownership.'],
          }
        : undefined,
    recommended_actions: [
      'Do not click any embedded links or open attachments.',
      'Never share OTPs, UPI PINs, passwords, or KYC document numbers.',
      'Verify the message exclusively through the official bank app or official customer care website.',
      'Block the sender and report the number/message as spam.',
    ],
    india_guidance: {
      applicable: true,
      reportingAuthority: 'National Cyber Crime Reporting Portal (I4C, MHA)',
      helpline: '1930',
      portalUrl: 'https://cybercrime.gov.in',
      immediateSteps: [
        'Call 1930 immediately if financial loss occurred within the golden hour to freeze fraudulent recipient accounts.',
        'File a formal complaint on cybercrime.gov.in with screenshots and transaction UTR numbers.',
        'Report suspicious SMS to Chakshu on sancharsaathi.gov.in to disconnect scammer SIMs.',
      ],
      upiOrBankingAction: 'Contact bank customer care to place a temporary freeze on UPI VPAs and internet banking.',
    },
    limitations: [
      'Automated analysis identifies defensive risk indicators and cannot independently prove legal guilt or criminal intent.',
      'Legitimate organizations can occasionally send unbranded notifications; always independently verify via official directory.',
    ],
  };
}
