export type ProjectStatus = 'Draft' | 'Analyzed' | 'Negotiating' | 'Closed';
export type DealSector = 'Energy' | 'M&A' | 'Corporate Finance' | 'General';
export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  sector: DealSector;
  dealSize: number;
  closingDate: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  expectedRiskValue: number;
  parties: string[];
}

export interface Clause {
  id: string;
  projectId: string;
  title: string;
  content: string;
  probability: number;
  exposure: number;
  mitigation: number;
  subjectiveFriction: number;
  expectedValue: number;
  riskLevel: RiskLevel;
  attorneyNotes: string;
  clarificationQuestion: string;
  aiRationale: string;
  createdAt: string;
}

export interface Template {
  id: string;
  name: string;
  sector: DealSector | 'Finance' | 'General';
  category: string;
  description: string;
  clauses: string[];
}

export interface AuditReport {
  id: string;
  projectId: string;
  timestamp: string;
  findings: AuditFinding[];
  overallScore: number;
  aiNarrative: string;
}

export interface AuditFinding {
  type: 'contradiction' | 'missing_definition' | 'financial_integrity' | 'risk_outlier';
  severity: RiskLevel;
  description: string;
  fiveWhys: string[];
  recommendation: string;
}

export interface BatchJob {
  id: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  totalVersions: number;
  completedVersions: number;
  logs: string[];
  startedAt: string;
  completedAt?: string;
}

export interface AgentLog {
  timestamp: string;
  agent: string;
  action: string;
  detail: string;
  status: 'thinking' | 'acting' | 'done' | 'error';
}
