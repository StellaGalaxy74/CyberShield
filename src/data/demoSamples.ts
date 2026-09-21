import { DemoSample } from '../types';

/**
 * Clean example input templates for users to test the scam analysis form.
 * These are strictly prompt templates and are NEVER pre-populated into the user's
 * investigation history or database.
 */
export const DEMO_SAMPLES: DemoSample[] = [
  {
    id: 'demo-phishing',
    title: 'Urgent Bank KYC Suspension Alert',
    type: 'text',
    label: 'Bank Phishing',
    description: 'Threatens immediate account block with an unverified verification link.',
    content: 'URGENT: Your SBI account #XXXX4892 will be suspended today due to pending KYC update. Verify your account immediately to avoid deactivation: http://sbi-kyc-update-portal.online/auth/login. Please do not ignore.',
    expectedScore: 92,
    expectedRisk: 'CRITICAL',
  },
  {
    id: 'demo-job',
    title: 'Work-From-Home Advance-Fee Scam',
    type: 'text',
    label: 'Job Scam',
    description: 'Promises ₹80,000/month salary for part-time tasks, requires upfront registration fee.',
    content: 'Congratulations! You have been shortlisted for an exclusive Amazon/YouTube Part-time Data Review job paying ₹80,000/month (2-3 hrs daily). No prior experience required. Pay ₹2,999 refundable kit fee to UPI: hr-verify@paytm to secure your onboarding slot today.',
    expectedScore: 88,
    expectedRisk: 'HIGH',
  },
  {
    id: 'demo-crypto',
    title: 'Guaranteed 300% Crypto Arbitrage',
    type: 'text',
    label: 'Investment Scam',
    description: 'Promises unrealistic guaranteed returns in 7 days with artificial scarcity.',
    content: 'VIP Wealth Crypto Signal: Guaranteed 300% return in 7 days! Institutional AI trading bot with zero loss guarantee. Only 4 VIP slots remaining before private pool closes. Send minimum ₹10,000 to USDT wallet address or UPI: quickgain@okhdfcbank to claim your daily payout.',
    expectedScore: 95,
    expectedRisk: 'CRITICAL',
  },
  {
    id: 'demo-safe',
    title: 'Official E-Commerce Shipping Update',
    type: 'text',
    label: 'Likely Safe Order Notification',
    description: 'Standard transactional dispatch update without credential or payment demands.',
    content: 'Hi Alex, your order #402-9182391 has been dispatched via BlueDart and is expected by tomorrow. You can track your parcel anytime directly inside the official Amazon app under "Your Orders". Thank you for shopping with us.',
    expectedScore: 12,
    expectedRisk: 'LOW',
  },
  {
    id: 'demo-url',
    title: 'Punycode / Fake Login URL',
    type: 'url',
    label: 'Deceptive Lookalike Domain',
    description: 'Suspicious domain attempting to impersonate an official banking gateway.',
    content: 'http://hdfc-netbanking-verify-secure.co.in.top/login.php?session=93821',
    expectedScore: 89,
    expectedRisk: 'CRITICAL',
  },
  {
    id: 'demo-screenshot',
    title: 'WhatsApp Extortion / Fake Customs Notice',
    type: 'screenshot',
    label: 'Extortion / Digital Arrest Chat',
    description: 'Impersonates customs officer threatening legal action unless immediate penalty is paid.',
    content: '[Screenshot of WhatsApp chat from +92-301-XXXXXX with Police insignia]: "Officer Sharma from Narcotics Bureau Mumbai. A contraband package containing illegal substances under your Aadhaar has been intercepted at airport. To cancel warrant and avoid arrest within 1 hour, deposit ₹45,000 clearance fee to CBI clearance account UPI: cbi-settle@axis."',
    expectedScore: 96,
    expectedRisk: 'CRITICAL',
  }
];
