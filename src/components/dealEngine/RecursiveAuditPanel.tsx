import React, { useState } from 'react';
import { Project, Clause, AuditReport } from '../../types';
import { auditDocument } from '../../lib/gemini';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Badge } from '../ui/Badge';
import { useClauses } from '../../hooks/useClauses';
import { ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

interface RecursiveAuditPanelProps {
  projects: Project[];
}

export function RecursiveAuditPanel({ projects }: RecursiveAuditPanelProps) {
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [expandedFindings, setExpandedFindings] = useState<Set<number>>(new Set());

  const { clauses } = useClauses(projectId);
  const project = projects.find((p) => p.id === projectId);

  async function handleAudit() {
    if (!project || clauses.length === 0) return;
    setLoading(true);
    const result = await auditDocument(clauses, project.name);
    result.projectId = projectId;
    setReport(result);
    setLoading(false);
  }

  function toggleFinding(i: number) {
    setExpandedFindings((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  const typeLabels: Record<string, string> = {
    contradiction: '⚡ Contradiction',
    missing_definition: '📖 Missing Definition',
    financial_integrity: '💰 Financial Integrity',
    risk_outlier: '🎯 Risk Outlier',
  };

  const scoreColor = (score: number) =>
    score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-rose-400';

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-400" /> Recursive Audit
        </h3>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-gray-400 text-xs mb-1.5">Project</label>
            <select
              value={projectId}
              onChange={(e) => { setProjectId(e.target.value); setReport(null); }}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="text-gray-400 text-sm">
            {clauses.length} clause{clauses.length !== 1 ? 's' : ''}
          </div>
          <button
            onClick={handleAudit}
            disabled={loading || clauses.length === 0}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? <LoadingSpinner size="sm" /> : <ShieldCheck size={14} />}
            {loading ? 'Auditing...' : 'Run Full Audit'}
          </button>
        </div>
      </div>

      {report && (
        <div className="space-y-4">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Audit Report</h3>
              <div className="text-center">
                <p className="text-gray-500 text-xs">Overall Score</p>
                <p className={`text-3xl font-bold ${scoreColor(report.overallScore)}`}>{report.overallScore}</p>
                <p className="text-gray-500 text-xs">/ 100</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{report.aiNarrative}</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-white font-semibold">Findings ({report.findings.length})</h3>
            {report.findings.map((f, i) => (
              <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
                  onClick={() => toggleFinding(i)}
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={f.severity} />
                    <span className="text-gray-300 text-sm">{typeLabels[f.type] || f.type}</span>
                    <span className="text-gray-400 text-sm">{f.description.substring(0, 60)}...</span>
                  </div>
                  {expandedFindings.has(i) ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
                </button>
                {expandedFindings.has(i) && (
                  <div className="px-4 pb-4 border-t border-gray-800">
                    <p className="text-gray-300 text-sm mt-3 mb-3">{f.description}</p>
                    <div className="bg-gray-800/50 rounded-lg p-3 mb-3">
                      <p className="text-gray-400 text-xs font-semibold mb-2">Five Whys Analysis</p>
                      <ol className="space-y-1">
                        {f.fiveWhys.map((why, j) => (
                          <li key={j} className="text-gray-400 text-xs flex gap-2">
                            <span className="text-emerald-500 font-semibold">{j + 1}.</span>
                            {why}
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                      <p className="text-emerald-400 text-xs font-semibold mb-1">Recommendation</p>
                      <p className="text-gray-300 text-xs">{f.recommendation}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
