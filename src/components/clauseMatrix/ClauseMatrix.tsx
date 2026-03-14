import React, { useState } from 'react';
import { Project, Clause } from '../../types';
import { useClauses } from '../../hooks/useClauses';
import { ClauseRiskChart } from './ClauseRiskChart';
import { Badge } from '../ui/Badge';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface ClauseMatrixProps {
  projects: Project[];
}

type SortKey = keyof Pick<Clause, 'title' | 'probability' | 'exposure' | 'mitigation' | 'subjectiveFriction' | 'expectedValue' | 'riskLevel'>;

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(n);

const riskRowColors: Record<string, string> = {
  Low: 'border-l-2 border-l-emerald-500',
  Medium: 'border-l-2 border-l-amber-500',
  High: 'border-l-2 border-l-rose-500',
};

export function ClauseMatrix({ projects }: ClauseMatrixProps) {
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [sortKey, setSortKey] = useState<SortKey>('expectedValue');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [editNotes, setEditNotes] = useState<Record<string, string>>({});

  const { clauses, updateClause } = useClauses(projectId);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const sorted = [...clauses].sort((a, b) => {
    const av = a[sortKey] as number | string;
    const bv = b[sortKey] as number | string;
    if (typeof av === 'string' && typeof bv === 'string') {
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    }
    return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
  });

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronUp size={12} className="text-gray-600" />;
    return sortDir === 'asc' ? <ChevronUp size={12} className="text-emerald-400" /> : <ChevronDown size={12} className="text-emerald-400" />;
  }

  function ThBtn({ col, label }: { col: SortKey; label: string }) {
    return (
      <th
        onClick={() => handleSort(col)}
        className="cursor-pointer select-none text-left text-gray-400 font-medium pb-3 px-2 hover:text-white transition-colors whitespace-nowrap"
      >
        <span className="inline-flex items-center gap-1">{label} <SortIcon col={col} /></span>
      </th>
    );
  }

  async function handleNoteBlur(clauseId: string) {
    const note = editNotes[clauseId];
    if (note !== undefined) {
      await updateClause(clauseId, { attorneyNotes: note });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div>
          <label className="block text-gray-400 text-xs mb-1.5">Project</label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 min-w-[200px]"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="text-gray-400 text-sm mt-5">
          {clauses.length} clause{clauses.length !== 1 ? 's' : ''}
        </div>
      </div>

      {clauses.length > 0 && (
        <>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">Risk Overview</h3>
            <ClauseRiskChart clauses={clauses} />
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-900/80">
                    <ThBtn col="title" label="Title" />
                    <ThBtn col="probability" label="P" />
                    <ThBtn col="exposure" label="E ($)" />
                    <ThBtn col="mitigation" label="M" />
                    <ThBtn col="subjectiveFriction" label="S" />
                    <ThBtn col="expectedValue" label="EV ($)" />
                    <ThBtn col="riskLevel" label="Risk" />
                    <th className="text-left text-gray-400 font-medium pb-3 px-2">Attorney Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((clause) => (
                    <tr
                      key={clause.id}
                      className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${riskRowColors[clause.riskLevel]}`}
                    >
                      <td className="py-3 px-2 text-white font-medium">{clause.title}</td>
                      <td className="py-3 px-2 text-center text-gray-300">{(clause.probability * 100).toFixed(0)}%</td>
                      <td className="py-3 px-2 text-center text-gray-300">{fmt(clause.exposure)}</td>
                      <td className="py-3 px-2 text-center text-gray-300">{(clause.mitigation * 100).toFixed(0)}%</td>
                      <td className="py-3 px-2 text-center text-gray-300">{clause.subjectiveFriction.toFixed(1)}</td>
                      <td className="py-3 px-2 text-center text-rose-400 font-medium">{fmt(clause.expectedValue)}</td>
                      <td className="py-3 px-2 text-center"><Badge variant={clause.riskLevel} /></td>
                      <td className="py-3 px-2 min-w-[180px]">
                        <input
                          value={editNotes[clause.id] ?? clause.attorneyNotes}
                          onChange={(e) => setEditNotes((prev) => ({ ...prev, [clause.id]: e.target.value }))}
                          onBlur={() => handleNoteBlur(clause.id)}
                          className="w-full bg-gray-800/50 border border-transparent hover:border-gray-700 focus:border-emerald-500 rounded px-2 py-1 text-xs text-gray-300 focus:outline-none transition-colors"
                          placeholder="Add note..."
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {clauses.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No clauses found for this project. Generate clauses in the Deal Engine.</p>
        </div>
      )}
    </div>
  );
}
