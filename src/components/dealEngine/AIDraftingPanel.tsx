import React, { useState } from 'react';
import { Project, Clause, DealSector } from '../../types';
import { generateDealStructure } from '../../lib/gemini';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Badge } from '../ui/Badge';
import { Wand2 } from 'lucide-react';

interface AIDraftingPanelProps {
  projects: Project[];
  selectedProjectId?: string;
  preSelectedDealType?: string;
  onClausesGenerated: (clauses: Clause[], projectId: string) => void;
}

const DEAL_TYPES = ['PSA', 'APA', 'SPA', 'TCTA', 'NDA', 'LOI', 'Term Sheet', 'Merger Agreement', 'Operating Agreement'];

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(n);

export function AIDraftingPanel({ projects, selectedProjectId, preSelectedDealType, onClausesGenerated }: AIDraftingPanelProps) {
  const [projectId, setProjectId] = useState(selectedProjectId || projects[0]?.id || '');
  const [dealType, setDealType] = useState(preSelectedDealType || 'PSA');
  const [loading, setLoading] = useState(false);
  const [clauses, setClauses] = useState<Clause[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const project = projects.find((p) => p.id === projectId);

  async function handleGenerate() {
    if (!project) return;
    setLoading(true);
    const result = await generateDealStructure({
      dealType,
      sector: project.sector,
      parties: project.parties,
      dealSize: project.dealSize,
      description: project.description,
    });
    const withProject = result.map((c) => ({ ...c, projectId }));
    setClauses(withProject);
    onClausesGenerated(withProject, projectId);
    setLoading(false);
  }

  const selectCls = 'bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors';

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Wand2 size={16} className="text-emerald-400" /> Generate Deal Structure
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-400 text-xs mb-1.5">Project</label>
            <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className={`${selectCls} w-full`}>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1.5">Deal Type</label>
            <select value={dealType} onChange={(e) => setDealType(e.target.value)} className={`${selectCls} w-full`}>
              {DEAL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        {project && (
          <div className="bg-gray-800/50 rounded-lg p-3 mb-4 text-xs text-gray-400 grid grid-cols-3 gap-3">
            <div><span className="text-gray-500">Sector:</span> <span className="text-white">{project.sector}</span></div>
            <div><span className="text-gray-500">Size:</span> <span className="text-emerald-400">{fmt(project.dealSize)}</span></div>
            <div><span className="text-gray-500">Parties:</span> <span className="text-white">{project.parties.length}</span></div>
          </div>
        )}
        <button
          onClick={handleGenerate}
          disabled={!project || loading}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          {loading ? <LoadingSpinner size="sm" /> : <Wand2 size={14} />}
          {loading ? 'Generating...' : 'Generate Deal Structure'}
        </button>
      </div>

      {clauses.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-white font-semibold">Generated Clauses ({clauses.length})</h3>
          {clauses.map((c) => (
            <div key={c.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-white font-semibold">{c.title}</h4>
                <Badge variant={c.riskLevel} />
              </div>
              <p className="text-gray-400 text-sm mb-3">{c.content}</p>
              <div className="grid grid-cols-4 gap-3 mb-3 text-xs">
                <div className="bg-gray-800/50 rounded p-2 text-center">
                  <p className="text-gray-500">Probability</p>
                  <p className="text-white font-medium">{(c.probability * 100).toFixed(0)}%</p>
                </div>
                <div className="bg-gray-800/50 rounded p-2 text-center">
                  <p className="text-gray-500">Exposure</p>
                  <p className="text-white font-medium">{fmt(c.exposure)}</p>
                </div>
                <div className="bg-gray-800/50 rounded p-2 text-center">
                  <p className="text-gray-500">Mitigation</p>
                  <p className="text-white font-medium">{(c.mitigation * 100).toFixed(0)}%</p>
                </div>
                <div className="bg-gray-800/50 rounded p-2 text-center">
                  <p className="text-gray-500">Exp. Value</p>
                  <p className="text-rose-400 font-medium">{fmt(c.expectedValue)}</p>
                </div>
              </div>
              {c.clarificationQuestion && (
                <p className="text-amber-400 text-xs mb-2 italic">❓ {c.clarificationQuestion}</p>
              )}
              {c.aiRationale && (
                <p className="text-gray-500 text-xs mb-3">🤖 {c.aiRationale}</p>
              )}
              <div>
                <label className="block text-gray-400 text-xs mb-1">Attorney Notes</label>
                <textarea
                  value={notes[c.id] || ''}
                  onChange={(e) => setNotes((prev) => ({ ...prev, [c.id]: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500 h-16 resize-none"
                  placeholder="Add attorney notes..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
