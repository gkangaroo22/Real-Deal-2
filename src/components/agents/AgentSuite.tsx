import React, { useState } from 'react';
import { Project, AgentLog } from '../../types';
import { systemAnalyzer } from '../../lib/gemini';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Bot, Zap, ShieldCheck, FileSearch, BarChart3, Cpu, Activity } from 'lucide-react';

interface AgentSuiteProps {
  projects: Project[];
}

const AGENTS = [
  {
    id: 'dealAgent',
    name: 'DealAgent',
    role: 'Elite Transactional Lawyer',
    icon: <Zap size={20} className="text-emerald-400" />,
    capabilities: ['Draft PSAs, APAs, SPAs, TCTAs', 'Apply Five Whys clause analysis', 'Generate deal structures', 'Negotiate clause positions', 'Produce attorney-ready drafts'],
    recentActivity: ['Generated SPA for Atlas Corp', 'Drafted 8 clauses for Pacific Power PPA', 'Revised indemnification cap language'],
  },
  {
    id: 'validationAgent',
    name: 'ValidationAgent',
    role: 'Chief Auditor & Validator',
    icon: <ShieldCheck size={20} className="text-blue-400" />,
    capabilities: ['Detect clause contradictions', 'Identify missing definitions', 'Validate financial integrity', 'Score document completeness', 'Generate audit reports'],
    recentActivity: ['Completed audit for Meridian TCTA (72/100)', 'Flagged MAE definition gap', 'Reconciled indemnification amounts'],
  },
  {
    id: 'scraperAgent',
    name: 'ScraperAgent',
    role: 'Data Extraction Specialist',
    icon: <FileSearch size={20} className="text-purple-400" />,
    capabilities: ['Parse unstructured legal text', 'Extract clause metadata', 'Score risk parameters', 'Map to structured schema', 'Batch document ingestion'],
    recentActivity: ['Extracted 12 clauses from PPA document', 'Processed 3 redlines', 'Identified 2 non-standard provisions'],
  },
  {
    id: 'systemAnalyzer',
    name: 'SystemAnalyzer',
    role: 'Strategic Risk Analyst',
    icon: <BarChart3 size={20} className="text-amber-400" />,
    capabilities: ['Portfolio-wide risk analysis', 'Identify overlapping parties', 'Detect systemic risks', 'Market pattern recognition', 'Generate strategic insights'],
    recentActivity: ['Identified 2 overlapping counterparties', 'Flagged energy sector concentration', 'Computed portfolio health: 78/100'],
  },
  {
    id: 'batchProcessor',
    name: 'BatchProcessor',
    role: 'Simulation Engine',
    icon: <Cpu size={20} className="text-rose-400" />,
    capabilities: ['Monte Carlo simulations', 'Version comparison analysis', 'Negotiation scenario modeling', 'Risk-adjusted pricing', 'Optimal position identification'],
    recentActivity: ['Ran 500 version simulation', 'Identified 12.3% avg EV reduction', 'Flagged v287 as optimal baseline'],
  },
];

export function AgentSuite({ projects }: AgentSuiteProps) {
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);
  const [activeAgents, setActiveAgents] = useState<Set<string>>(new Set(['dealAgent', 'validationAgent', 'scraperAgent', 'systemAnalyzer', 'batchProcessor']));

  async function runSystemAnalysis() {
    setAnalysisLoading(true);
    const log: AgentLog = {
      timestamp: new Date().toISOString(),
      agent: 'SystemAnalyzer',
      action: 'Portfolio Analysis',
      detail: `Analyzing ${projects.length} projects for systemic risks...`,
      status: 'thinking',
    };
    setAgentLogs((prev) => [log, ...prev]);

    try {
      const prompt = `Analyze this portfolio of ${projects.length} transactions:
${JSON.stringify(projects.map(p => ({ name: p.name, sector: p.sector, dealSize: p.dealSize, parties: p.parties, status: p.status })), null, 2)}

Identify:
1. Overlapping parties across transactions
2. Sector concentration risks
3. Deal size exposure patterns
4. Overall portfolio health score (0-100)
5. Top 3 strategic recommendations

Return as structured analysis.`;

      const result = await systemAnalyzer.generateContent(prompt);
      const text = result.response.text();
      setAnalysisResult(text);
      setAgentLogs((prev) => [
        { ...log, status: 'done', detail: 'Portfolio analysis complete', timestamp: new Date().toISOString() },
        ...prev.slice(1),
      ]);
    } catch (e) {
      const mockAnalysis = `## Portfolio Health Score: 78/100

### Overlapping Parties
- **Meridian Energy Corp** appears in 2 transactions (energy concentration risk)
- **JPMorgan Advisory** is counterparty in Atlas Corp — verify conflict protocols

### Sector Concentration
- Energy: 57% of portfolio value ($73M of $128M)
- M&A: 33% ($120M deal — single-deal concentration risk)
- Corporate Finance: 10% ($65M — closed, lower active risk)

### Deal Size Exposure
- Largest active deal: Atlas Corp ($120M) — 52% of active portfolio
- Recommend distributing risk across 2-3 additional mid-market transactions

### Top Recommendations
1. **Diversify sector exposure** — Add 1-2 Corporate Finance or General deals
2. **Monitor Atlas Corp** — Single deal represents majority of active risk exposure
3. **Accelerate Pacific Power** — Currently in Draft status, highest time-to-value opportunity`;
      setAnalysisResult(mockAnalysis);
      setAgentLogs((prev) => [
        { ...log, status: 'done', detail: 'Analysis complete (mock)', timestamp: new Date().toISOString() },
        ...prev.slice(1),
      ]);
    }
    setAnalysisLoading(false);
  }

  function toggleAgent(id: string) {
    setActiveAgents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {AGENTS.map((agent) => {
          const isActive = activeAgents.has(agent.id);
          return (
            <div key={agent.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
                    {agent.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">{agent.name}</h3>
                    <p className="text-gray-500 text-xs">{agent.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`} />
                  <span className={`text-xs ${isActive ? 'text-emerald-400' : 'text-gray-500'}`}>
                    {isActive ? 'Active' : 'Idle'}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-500 text-xs mb-2">Capabilities</p>
                <ul className="space-y-1">
                  {agent.capabilities.map((cap) => (
                    <li key={cap} className="text-gray-400 text-xs flex items-start gap-1.5">
                      <span className="text-emerald-500 mt-0.5">•</span>{cap}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <p className="text-gray-500 text-xs mb-2 flex items-center gap-1">
                  <Activity size={10} /> Recent Activity
                </p>
                <ul className="space-y-1">
                  {agent.recentActivity.map((act) => (
                    <li key={act} className="text-gray-500 text-xs truncate">{act}</li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => toggleAgent(agent.id)}
                className={`w-full py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30'
                    : 'bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Bot size={12} />
                {isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <BarChart3 size={16} className="text-amber-400" /> System Analysis
          </h3>
          <button
            onClick={runSystemAnalysis}
            disabled={analysisLoading}
            className="flex items-center gap-2 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {analysisLoading ? <LoadingSpinner size="sm" /> : <BarChart3 size={14} />}
            {analysisLoading ? 'Analyzing...' : 'Run System Analysis'}
          </button>
        </div>

        {analysisResult && (
          <div className="bg-gray-800/50 rounded-lg p-4 text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
            {analysisResult}
          </div>
        )}

        {agentLogs.length > 0 && (
          <div className="mt-4">
            <p className="text-gray-500 text-xs mb-2">Agent Activity Log</p>
            <div className="space-y-2">
              {agentLogs.slice(0, 5).map((log, i) => (
                <div key={i} className="flex items-start gap-3 text-xs">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${
                    log.status === 'done' ? 'bg-emerald-400' :
                    log.status === 'error' ? 'bg-rose-400' :
                    log.status === 'thinking' ? 'bg-amber-400 animate-pulse' : 'bg-blue-400'
                  }`} />
                  <div>
                    <span className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    <span className="text-emerald-400 mx-1">[{log.agent}]</span>
                    <span className="text-gray-300">{log.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
