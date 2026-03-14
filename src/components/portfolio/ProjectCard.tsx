import React from 'react';
import { Project } from '../../types';
import { Badge } from '../ui/Badge';
import { Calendar, DollarSign, Users } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(n);

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 cursor-pointer hover:border-emerald-500/50 hover:bg-gray-900 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-white font-semibold text-sm group-hover:text-emerald-400 transition-colors leading-tight pr-2">
          {project.name}
        </h3>
        <Badge variant={project.status} />
      </div>
      <div className="flex items-center gap-2 mb-3">
        <Badge variant={project.sector} />
      </div>
      <p className="text-gray-500 text-xs mb-4 line-clamp-2">{project.description}</p>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <DollarSign size={12} className="text-emerald-500" />
          <span>{fmt(project.dealSize)}</span>
          <span className="text-gray-600">•</span>
          <span className="text-rose-400">{fmt(project.expectedRiskValue)} risk</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Calendar size={12} className="text-emerald-500" />
          <span>Closes {new Date(project.closingDate).toLocaleDateString()}</span>
        </div>
        {project.parties.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Users size={12} className="text-emerald-500" />
            <span className="truncate">{project.parties.slice(0, 2).join(', ')}{project.parties.length > 2 ? ` +${project.parties.length - 2}` : ''}</span>
          </div>
        )}
      </div>
    </div>
  );
}
