import React from 'react';
import { Project, Clause } from '../../types';
import { Badge } from '../ui/Badge';
import { ArrowLeft, DollarSign, Calendar, Users, AlertTriangle, Zap, Grid3X3 } from 'lucide-react';

interface ProjectDetailProps {
  project: Project;
  clauses: Clause[];
  onBack: () => void;
  onGoToDealEngine: () => void;
  onGoToClauseMatrix: () => void;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export function ProjectDetail({ project, clauses, onBack, onGoToDealEngine, onGoToClauseMatrix }: ProjectDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm">
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{project.name}</h2>
            <div className="flex items-center gap-2">
              <Badge variant={project.status} />
              <Badge variant={project.sector} />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onGoToDealEngine}
              className="flex items-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 px-3 py-2 rounded-lg text-sm transition-colors"
            >
              <Zap size={14} /> Deal Engine
            </button>
            <button
              onClick={onGoToClauseMatrix}
              className="flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 px-3 py-2 rounded-lg text-sm transition-colors"
            >
              <Grid3X3 size={14} /> Clause Matrix
            </button>
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-6">{project.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign size={14} className="text-emerald-400" />
              <span className="text-gray-400 text-xs">Deal Size</span>
            </div>
            <p className="text-white font-bold">{fmt(project.dealSize)}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={14} className="text-rose-400" />
              <span className="text-gray-400 text-xs">Risk Value</span>
            </div>
            <p className="text-rose-400 font-bold">{fmt(project.expectedRiskValue)}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={14} className="text-blue-400" />
              <span className="text-gray-400 text-xs">Closing Date</span>
            </div>
            <p className="text-white font-bold">{new Date(project.closingDate).toLocaleDateString()}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users size={14} className="text-purple-400" />
              <span className="text-gray-400 text-xs">Parties</span>
            </div>
            <p className="text-white font-bold">{project.parties.length}</p>
          </div>
        </div>

        {project.parties.length > 0 && (
          <div className="mt-4">
            <p className="text-gray-400 text-xs mb-2">Parties Involved</p>
            <div className="flex flex-wrap gap-2">
              {project.parties.map((party, i) => (
                <span key={i} className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full border border-gray-700">
                  {party}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {clauses.length > 0 && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Clauses ({clauses.length})</h3>
          <div className="space-y-3">
            {clauses.map((clause) => (
              <div key={clause.id} className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white text-sm font-medium">{clause.title}</h4>
                  <Badge variant={clause.riskLevel} />
                </div>
                <p className="text-gray-400 text-xs mb-2 line-clamp-2">{clause.content}</p>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>P: {(clause.probability * 100).toFixed(0)}%</span>
                  <span>E: {fmt(clause.exposure)}</span>
                  <span>M: {(clause.mitigation * 100).toFixed(0)}%</span>
                  <span className="text-rose-400">EV: {fmt(clause.expectedValue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
