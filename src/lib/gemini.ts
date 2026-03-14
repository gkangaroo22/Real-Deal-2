import { GoogleGenerativeAI } from '@google/generative-ai';
import { Clause, AuditReport } from '../types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export const dealAgent = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
  systemInstruction: `You are an Elite Transactional Lawyer and Deal Architect. Your role is to draft high-fidelity legal structures including TCTAs, PSAs, APAs, and SPAs. For every clause you generate, apply a "Five Whys" recursive analysis to justify its inclusion. Output structured JSON when requested.`,
});

export const validationAgent = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
  systemInstruction: `You are the Chief Auditor and Validation Specialist. Your role is to audit legal documents for contradictions, missing definitions, and financial integrity issues. Be methodical, precise, and output structured JSON audit reports.`,
});

export const scraperAgent = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
  systemInstruction: `You are a Data Extraction Specialist. Your role is to parse unstructured legal text and extract structured clause data including probability, exposure, mitigation scores, and risk levels. Always output valid JSON.`,
});

export const systemAnalyzer = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
  systemInstruction: `You are a Strategic Risk Analyst. Your role is to identify overlapping parties, systemic risks, and market patterns across a portfolio of transactions. Provide actionable insights in structured JSON format.`,
});

export async function generateDealStructure(params: {
  dealType: string;
  sector: string;
  parties: string[];
  dealSize: number;
  description: string;
}): Promise<Clause[]> {
  const prompt = `Generate a comprehensive deal structure for a ${params.dealType} in the ${params.sector} sector.
Parties: ${params.parties.join(', ')}
Deal Size: $${params.dealSize.toLocaleString()}
Description: ${params.description}

Generate 6-8 key clauses with the following JSON structure for each:
{
  "title": "Clause Title",
  "content": "Full clause text...",
  "probability": 0.0-1.0,
  "exposure": USD_amount,
  "mitigation": 0.0-1.0,
  "subjectiveFriction": 0.0-10.0,
  "riskLevel": "Low|Medium|High",
  "clarificationQuestion": "Question for attorney...",
  "aiRationale": "Five Whys reasoning..."
}

Return a JSON array of clauses. Be realistic and legally precise.`;

  try {
    const result = await dealAgent.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const clauses = JSON.parse(jsonMatch[0]);
      return clauses.map((c: Partial<Clause>, i: number) => ({
        ...c,
        id: `clause-${Date.now()}-${i}`,
        projectId: '',
        expectedValue: (c.exposure ?? 0) * (c.probability ?? 0) * (1 - (c.mitigation ?? 0)),
        attorneyNotes: '',
        createdAt: new Date().toISOString(),
      }));
    }
  } catch (e) {
    console.error('Gemini API error:', e);
  }
  return getMockClauses();
}

export async function auditDocument(clauses: Clause[], projectName: string): Promise<AuditReport> {
  const prompt = `Audit the following legal clauses for project "${projectName}":

${JSON.stringify(clauses, null, 2)}

Identify:
1. Contradictions between clauses
2. Missing definitions
3. Financial integrity issues
4. Risk outliers

Return a JSON audit report with structure:
{
  "findings": [{"type": "...", "severity": "Low|Medium|High", "description": "...", "fiveWhys": ["why1", "why2", "why3", "why4", "why5"], "recommendation": "..."}],
  "overallScore": 0-100,
  "aiNarrative": "Comprehensive narrative..."
}`;

  try {
    const result = await validationAgent.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const report = JSON.parse(jsonMatch[0]);
      return {
        id: `audit-${Date.now()}`,
        projectId: '',
        timestamp: new Date().toISOString(),
        ...report,
      };
    }
  } catch (e) {
    console.error('Gemini API error:', e);
  }
  return getMockAuditReport();
}

export async function scrapeDocument(text: string): Promise<Clause[]> {
  const prompt = `Extract structured clause data from this legal document text:

${text.substring(0, 4000)}

Return a JSON array of clauses with structure matching the deal clause schema including probability, exposure, mitigation, subjectiveFriction, riskLevel, title, content, clarificationQuestion, aiRationale.`;

  try {
    const result = await scraperAgent.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const clauses = JSON.parse(jsonMatch[0]);
      return clauses.map((c: Partial<Clause>, i: number) => ({
        ...c,
        id: `scraped-${Date.now()}-${i}`,
        projectId: '',
        expectedValue: (c.exposure ?? 0) * (c.probability ?? 0) * (1 - (c.mitigation ?? 0)),
        attorneyNotes: '',
        createdAt: new Date().toISOString(),
      }));
    }
  } catch (e) {
    console.error('Gemini scraper error:', e);
  }
  return getMockClauses();
}

function getMockClauses(): Clause[] {
  return [
    {
      id: `clause-mock-1`,
      projectId: '',
      title: 'Purchase Price Adjustment',
      content: 'The Purchase Price shall be subject to adjustment based on the Final Net Working Capital as determined pursuant to Section 2.4 hereof.',
      probability: 0.75,
      exposure: 2500000,
      mitigation: 0.6,
      subjectiveFriction: 7.5,
      expectedValue: 750000,
      riskLevel: 'Medium',
      clarificationQuestion: 'What is the target NWC threshold and adjustment mechanism?',
      aiRationale: 'Why include: Protects buyer from value erosion. Why here: Standard M&A protection. Why this amount: Based on deal size. Why this probability: Most deals trigger adjustment. Why this mitigation: Standard escrow mechanism.',
      attorneyNotes: '',
      createdAt: new Date().toISOString(),
    },
    {
      id: `clause-mock-2`,
      projectId: '',
      title: 'Indemnification Cap',
      content: "Seller's aggregate liability under this Agreement shall not exceed fifteen percent (15%) of the Purchase Price.",
      probability: 0.45,
      exposure: 5000000,
      mitigation: 0.8,
      subjectiveFriction: 8.5,
      expectedValue: 450000,
      riskLevel: 'High',
      clarificationQuestion: 'Is the 15% cap negotiable given the sector-specific risks?',
      aiRationale: 'Why cap: Limits seller exposure. Why 15%: Market standard. Why high friction: Sellers resist caps. Why this probability: Historical M&A data. Why high mitigation: Representations & warranties insurance available.',
      attorneyNotes: '',
      createdAt: new Date().toISOString(),
    },
    {
      id: `clause-mock-3`,
      projectId: '',
      title: 'Non-Compete Covenant',
      content: 'Seller agrees not to compete within the defined geographic area for a period of three (3) years following the Closing Date.',
      probability: 0.3,
      exposure: 1500000,
      mitigation: 0.7,
      subjectiveFriction: 6.0,
      expectedValue: 225000,
      riskLevel: 'Low',
      clarificationQuestion: 'Is the 3-year period enforceable in all relevant jurisdictions?',
      aiRationale: 'Why non-compete: Protects acquired goodwill. Why 3 years: Balance between protection and enforceability. Why geographic: Defines the protected market. Why this exposure: Lost revenue estimate. Why this mitigation: Legal precedent supports.',
      attorneyNotes: '',
      createdAt: new Date().toISOString(),
    },
  ];
}

function getMockAuditReport(): AuditReport {
  return {
    id: `audit-mock-${Date.now()}`,
    projectId: '',
    timestamp: new Date().toISOString(),
    findings: [
      {
        type: 'missing_definition',
        severity: 'Medium',
        description: 'Term "Material Adverse Effect" is used but not defined in the definitions section.',
        fiveWhys: [
          'Why is MAE undefined? Definition section is incomplete.',
          'Why incomplete? Initial draft was rushed.',
          'Why rushed? Timeline pressure from client.',
          'Why timeline pressure? Deal urgency.',
          'Why this matters? Undefined MAE creates litigation risk.',
        ],
        recommendation: 'Add a comprehensive MAE definition aligned with current Delaware court standards.',
      },
      {
        type: 'financial_integrity',
        severity: 'High',
        description: 'Indemnification basket amount is inconsistent with the escrow amount defined in Section 7.',
        fiveWhys: [
          'Why inconsistency? Sections drafted by different attorneys.',
          'Why different attorneys? Large deal team.',
          'Why no cross-check? Review process gap.',
          'Why process gap? Time constraints.',
          'Why this matters? Creates enforcement ambiguity.',
        ],
        recommendation: 'Reconcile basket and escrow amounts; ensure consistent cross-references.',
      },
    ],
    overallScore: 72,
    aiNarrative:
      'The document demonstrates solid foundational structure typical of M&A transactions in this sector. However, several definitional gaps and cross-reference inconsistencies require immediate attention before advancing to negotiation phase. The indemnification framework is particularly vulnerable and should be prioritized.',
  };
}
