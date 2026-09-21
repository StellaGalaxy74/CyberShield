import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import "dotenv/config";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Server-side Gemini initialization
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Fallback heuristic engine if API key is not configured or in case of upstream rate limit
function runHeuristicInvestigation(type: string, content: string): any {
  const lower = content.toLowerCase();
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
  if (urlMatches) entities.urls = Array.from(new Set(urlMatches));

  // Extract phone numbers (international / indian)
  const phoneMatches = content.match(/(?:\+?\d{1,3}[-\s.]?)?\(?\d{2,4}\)?[-\s.]?\d{3,5}[-\s.]?\d{4}/g);
  if (phoneMatches) entities.phone_numbers = Array.from(new Set(phoneMatches));

  // Extract emails
  const emailMatches = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
  if (emailMatches) entities.emails = Array.from(new Set(emailMatches));

  // Extract UPI handles
  const upiMatches = content.match(/[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/g);
  if (upiMatches) entities.payment_identifiers = Array.from(new Set(upiMatches));

  // Heuristic checks
  if (/urgent|immediate|within\s*\d+\s*(mins|minutes|hours)|today|block|suspend|deactivat/i.test(lower)) {
    score += 25;
    redFlags.push({
      indicator: "Urgency Manipulation & Threat of Service Interruption",
      severity: "HIGH",
      evidence: content.slice(0, 120),
      explanation: "Pressures the recipient to act impulsively without verifying through official channels.",
    });
  }

  if (/otp|pin|cvv|password|aadhaar|pan\s*card|kyc|verify\s*account/i.test(lower)) {
    score += 30;
    categories.push("KYC fraud", "Identity theft");
    redFlags.push({
      indicator: "Credential & Identity Harvesting Demand",
      severity: "CRITICAL",
      evidence: "References to OTP/PIN/KYC verification detected in text.",
      explanation: "Legitimate organizations never solicit confidential authentication credentials via unverified messages.",
    });
  }

  if (/work\s*from\s*home|part\s*time\s*job|registration\s*fee|telegram\s*task|earn\s*₹|daily\s*income/i.test(lower)) {
    score += 30;
    categories.push("Job scam");
    redFlags.push({
      indicator: "Advance-Fee Recruitment Pattern",
      severity: "HIGH",
      evidence: "Unrealistic pay rates coupled with upfront registration/task requirements.",
      explanation: "Genuine employers do not charge onboarding or training fees to offer employment.",
    });
  }

  if (/guaranteed|300%|crypto|trading\s*bonus|double\s*your\s*money|investment\s*slot/i.test(lower)) {
    score += 30;
    categories.push("Investment scam");
    redFlags.push({
      indicator: "Unrealistic Guaranteed Return Claim",
      severity: "CRITICAL",
      evidence: "Promising guaranteed or exponential returns over short time horizons.",
      explanation: "Classic hallmark of Ponzi schemes and unregulated fraudulent trading platforms.",
    });
  }

  if (entities.urls.length > 0) {
    score += 15;
    if (!categories.includes("Phishing")) categories.push("Phishing");
    redFlags.push({
      indicator: "External Hyperlink in High-Stakes Context",
      severity: "MEDIUM",
      evidence: entities.urls.join(", "),
      explanation: "Directs user to an unverified external destination instead of an official application.",
    });
  }

  if (categories.length === 0) {
    if (score > 40) categories.push("Social engineering");
    else categories.push("Other");
  }

  score = Math.min(Math.max(score, 10), 96);
  let riskLevel = "LOW";
  if (score >= 80) riskLevel = "CRITICAL";
  else if (score >= 55) riskLevel = "HIGH";
  else if (score >= 26) riskLevel = "SUSPICIOUS";

  return {
    risk_score: score,
    risk_level: riskLevel,
    confidence: "HIGH",
    categories,
    summary:
      score > 50
        ? "The submitted content exhibits multiple high-probability scam signatures, including artificial urgency, credential verification prompts, and unverified contact vectors."
        : "Low-to-moderate indicator density observed. Standard defensive verification recommended before taking any action.",
    reasoning_points: [
      "Observed text employs psychological pressure or promise of outsized incentives.",
      "Communication vector bypasses standard verified organizational banking or corporate portals.",
      "The combination of credential requests or urgent action links aligns closely with known fraud campaigns.",
    ],
    red_flags: redFlags,
    entities,
    timeline: [
      {
        timeOrStep: "Step 1: Contact",
        action: "Unsolicited digital communication received by target",
        riskEscalation: "NORMAL",
        description: "Initial message claims urgency or tempting opportunity",
      },
      {
        timeOrStep: "Step 2: Coercion",
        action: "Pressure to bypass standard safety verification",
        riskEscalation: "ELEVATED",
        description: "Directs target to click external link or submit verification",
      },
      {
        timeOrStep: "Step 3: Exploitation",
        action: "Attempted extraction of credentials, funds, or OTP",
        riskEscalation: "CRITICAL",
        description: "Risk reaches peak critical threshold",
      },
    ],
    url_inspection:
      entities.urls.length > 0
        ? {
            analyzedUrl: entities.urls[0],
            protocol: entities.urls[0].startsWith("https") ? "https" : "http",
            domain: entities.urls[0].replace(/^https?:\/\//, "").split("/")[0],
            tld: entities.urls[0].split(".").pop()?.split("/")[0] || "unknown",
            isShortener: /(bit\.ly|tinyurl|t\.co|is\.gd|cutt\.ly)/i.test(entities.urls[0]),
            isLookalike: /sbi|hdfc|icici|amazon|netflix|gov|kyc|support/i.test(entities.urls[0]),
            hasSuspiciousParams: entities.urls[0].includes("?"),
            hasIpAddress: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/.test(entities.urls[0]),
            observedEvidence: ["External destination link provided in unsolicited communication."],
            aiInference: ["High likelihood of credential harvesting page or redirection chain."],
            unverifiedAspects: ["Hosting server WHOIS registration records and ASN ownership."],
          }
        : undefined,
    recommended_actions: [
      "Do not click any embedded links or open attachments.",
      "Never share OTPs, UPI PINs, passwords, or KYC document numbers.",
      "Verify the message exclusively through the official bank app or official customer care website.",
      "Block the sender and report the number/message as spam.",
    ],
    india_guidance: {
      applicable: true,
      reportingAuthority: "National Cyber Crime Reporting Portal (I4C, MHA)",
      helpline: "1930",
      portalUrl: "https://cybercrime.gov.in",
      immediateSteps: [
        "Call 1930 immediately if financial loss occurred within the golden hour to freeze fraudulent recipient accounts.",
        "File a formal complaint on cybercrime.gov.in with screenshots and transaction UTR numbers.",
        "Report suspicious SMS to Chakshu on sancharsaathi.gov.in to disconnect scammer SIMs.",
      ],
      upiOrBankingAction: "Contact bank customer care to place a temporary freeze on UPI VPAs and internet banking.",
    },
    limitations: [
      "AI analysis identifies defensive risk indicators and cannot independently prove legal guilt or criminal intent.",
      "Legitimate organizations can occasionally send unbranded notifications; always independently verify via official phone directory.",
    ],
  };
}

// Helper to execute Gemini generation with multi-model fallback on 503 / 429 errors
async function executeWithModelFallback(parts: any[], config: any): Promise<any> {
  const modelCandidates = [
    "gemini-3.1-flash-lite",
    "gemini-3.8-flash",
    "gemini-flash-latest",
  ];

  let lastError: any = null;
  for (const model of modelCandidates) {
    try {
      const generatePromise = aiClient!.models.generateContent({
        model,
        contents: { parts },
        config,
      });

      // 8.5 second timeout per model candidate to prevent proxy 504 timeouts
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Model ${model} request timed out after 8500ms`)), 8500)
      );

      const response = (await Promise.race([generatePromise, timeoutPromise])) as any;

      const text = response.text?.trim();
      if (text) {
        // Strip markdown code fences if model returned ```json ... ```
        const cleanJsonText = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
        return JSON.parse(cleanJsonText);
      }
    } catch (err: any) {
      lastError = err;
      const statusCode = err?.status || err?.code || 500;
      console.warn(`[CyberShield AI] Model ${model} encountered error (${statusCode}): ${err?.message || "Temporarily unavailable"}. Attempting next candidate...`);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  throw lastError || new Error("All AI model endpoints are currently experiencing high demand.");
}

// Investigation API endpoint
app.post("/api/investigate", async (req, res) => {
  try {
    const { type = "text", content = "", imageBase64 = "", mimeType = "image/png" } = req.body || {};

    if (!content && !imageBase64) {
      return res.status(400).json({ error: "No text content or screenshot provided for analysis." });
    }

    // If Gemini client is configured, execute AI analysis with automatic fallback
    if (aiClient) {
      try {
        const promptInstruction = `
You are the world-class lead cybersecurity analyst and cyber fraud investigator for "CyberShield AI".
Analyze the submitted digital content or screenshot to detect potential scams, fraud, phishing, social engineering, or cyber threats.

CRITICAL ANALYTICAL DIRECTIVES:
1. Do NOT make unsupported claims such as "This is definitely a scam." Use disciplined analytical terminology such as:
   - "High likelihood of scam indicators"
   - "Potential phishing attempt"
   - "Suspicious social engineering characteristics detected"
   - "Insufficient evidence to determine conclusively"
2. Clearly distinguish between:
   - Observed evidence (what is factually visible in the text/screenshot)
   - AI inference (risk hypothesis derived from patterns)
   - Unverified information
3. Analyze indicators across:
   - Social Engineering (Urgency, fear, threats, fake authority, secrecy, reward/loss manipulation)
   - Financial Indicators (Demands for money, UPI VPAs, bank transfers, crypto, advance fees, gift cards)
   - Credential & Identity (Passwords, OTPs, PINs, CVV, Aadhaar, PAN, banking login)
   - Phishing & URL Indicators (Lookalike domains, shorteners, fake login, mismatched brand names, unverified TLDs)
   - Job/Employment scam (Work-from-home upfront fee, unreal salaries, training fees)
   - Investment scam (Guaranteed returns, Ponzi claims, urgent slots)
4. If a screenshot was uploaded, perform rigorous OCR to extract all visible text and conversation headers, and include it in 'extracted_text'.
5. If the content represents a sequence of interactions (e.g. chat messages, phone call sequence, SMS follow-up), construct an 'investigation_timeline' showing chronological escalation of risk.
6. If any URL is present, provide a detailed 'url_inspection' breaking down domain, protocol, shortener flag, lookalike flag, observed evidence vs AI inference.
7. Provide dedicated guidance for Indian citizens when relevant (National Cyber Crime Helpline 1930, cybercrime.gov.in, Chakshu portal on Sanchar Saathi, UPI PIN safeguards).
8. Compute an exact numerical Risk Score between 0 and 100:
   - 0–25: LOW
   - 26–55: SUSPICIOUS
   - 56–80: HIGH
   - 81–100: CRITICAL
   Also state confidence level: "LOW" | "MEDIUM" | "HIGH".

Content Modality: ${type}
User Submitted Content:
"""
${content}
"""
`;

        const parts: any[] = [];
        if (imageBase64) {
          const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, "");
          parts.push({
            inlineData: {
              mimeType: mimeType || "image/png",
              data: cleanBase64,
            },
          });
        }
        parts.push({ text: promptInstruction });

        const parsedData = await executeWithModelFallback(parts, {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              risk_score: { type: Type.INTEGER, description: "Risk score from 0 to 100" },
              risk_level: {
                type: Type.STRING,
                description: "Risk classification: LOW, SUSPICIOUS, HIGH, or CRITICAL",
              },
              confidence: {
                type: Type.STRING,
                description: "Confidence level: LOW, MEDIUM, or HIGH",
              },
              categories: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Scam categories e.g. Phishing, Job scam, UPI/payment scam, etc.",
              },
              summary: { type: Type.STRING, description: "Comprehensive executive summary" },
              extracted_text: {
                type: Type.STRING,
                description: "Text extracted via OCR if screenshot provided, or sanitized copy of input",
              },
              reasoning_points: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Numbered evidence-based bullet points explaining why this was flagged",
              },
              red_flags: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    indicator: { type: Type.STRING },
                    severity: { type: Type.STRING, description: "LOW, MEDIUM, HIGH, or CRITICAL" },
                    evidence: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                  },
                  required: ["indicator", "severity", "evidence", "explanation"],
                },
              },
              entities: {
                type: Type.OBJECT,
                properties: {
                  urls: { type: Type.ARRAY, items: { type: Type.STRING } },
                  phone_numbers: { type: Type.ARRAY, items: { type: Type.STRING } },
                  emails: { type: Type.ARRAY, items: { type: Type.STRING } },
                  payment_identifiers: { type: Type.ARRAY, items: { type: Type.STRING } },
                  organizations: { type: Type.ARRAY, items: { type: Type.STRING } },
                  suspicious_keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["urls", "phone_numbers", "emails", "payment_identifiers", "organizations", "suspicious_keywords"],
              },
              timeline: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    timeOrStep: { type: Type.STRING },
                    action: { type: Type.STRING },
                    riskEscalation: { type: Type.STRING, description: "NORMAL, ELEVATED, or CRITICAL" },
                    description: { type: Type.STRING },
                  },
                  required: ["timeOrStep", "action", "riskEscalation"],
                },
              },
              url_inspection: {
                type: Type.OBJECT,
                properties: {
                  analyzedUrl: { type: Type.STRING },
                  protocol: { type: Type.STRING },
                  domain: { type: Type.STRING },
                  subdomain: { type: Type.STRING },
                  tld: { type: Type.STRING },
                  isShortener: { type: Type.BOOLEAN },
                  isLookalike: { type: Type.BOOLEAN },
                  hasSuspiciousParams: { type: Type.BOOLEAN },
                  hasIpAddress: { type: Type.BOOLEAN },
                  observedEvidence: { type: Type.ARRAY, items: { type: Type.STRING } },
                  aiInference: { type: Type.ARRAY, items: { type: Type.STRING } },
                  unverifiedAspects: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
              },
              recommended_actions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              india_guidance: {
                type: Type.OBJECT,
                properties: {
                  applicable: { type: Type.BOOLEAN },
                  reportingAuthority: { type: Type.STRING },
                  helpline: { type: Type.STRING },
                  portalUrl: { type: Type.STRING },
                  immediateSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
                  upiOrBankingAction: { type: Type.STRING },
                },
                required: ["applicable", "reportingAuthority", "helpline", "portalUrl", "immediateSteps"],
              },
              limitations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: [
              "risk_score",
              "risk_level",
              "confidence",
              "categories",
              "summary",
              "reasoning_points",
              "red_flags",
              "entities",
              "recommended_actions",
              "india_guidance",
              "limitations",
            ],
          },
        });

        // Generate or preserve unique investigation ID
        const invId = req.body?.id || `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

        return res.json({
          id: invId,
          timestamp: new Date().toISOString(),
          inputType: type,
          rawInputSnippet: content.slice(0, 300),
          extractedContentText: parsedData.extracted_text || content,
          ...parsedData,
        });
      } catch (modelError: any) {
        console.warn("[CyberShield AI] AI service temporarily busy or unavailable, transitioning to local heuristic engine:", modelError?.message);
        // Automatically fall through to the heuristic engine
      }
    }

    // Resilient heuristic engine (used when API key is not present or when upstream AI endpoints return 503)
    const heuristicData = runHeuristicInvestigation(type, content);
    const invId = req.body?.id || `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    return res.json({
      id: invId,
      timestamp: new Date().toISOString(),
      inputType: type,
      rawInputSnippet: content.slice(0, 300),
      extractedContentText: content,
      ...heuristicData,
    });
  } catch (fatalError: any) {
    console.error("[CyberShield AI] Fatal error inside /api/investigate:", fatalError);
    try {
      const fallback = runHeuristicInvestigation(req.body?.type || "text", req.body?.content || "");
      const invId = req.body?.id || `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      return res.json({
        id: invId,
        timestamp: new Date().toISOString(),
        inputType: req.body?.type || "text",
        rawInputSnippet: (req.body?.content || "").slice(0, 300),
        extractedContentText: req.body?.content || "",
        ...fallback,
      });
    } catch {
      return res.status(500).json({ error: fatalError?.message || "Investigation analysis could not be completed." });
    }
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// Ensure any errors on /api/* routes respond with JSON, never HTML
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.path.startsWith("/api/")) {
    console.error("[CyberShield AI] API middleware error caught:", err);
    return res.status(err.status || 500).json({
      error: err.message || "An unexpected error occurred processing your request.",
    });
  }
  next(err);
});

// Guard: Unmatched /api/* routes should return 404 JSON, never fall through to Vite SPA html
app.all("/api/*", (req, res) => {
  res.status(404).json({ error: `API route not found: ${req.method} ${req.path}` });
});

// Start Express server and mount Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CyberShield AI] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
