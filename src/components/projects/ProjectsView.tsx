import React, { useState } from 'react';
import { Project, ProjectStatus, DealSector } from '../../types';
import { ProjectCard } from '../portfolio/ProjectCard';
import { ProjectDetail } from './ProjectDetail';
import { CreateProjectModal } from './CreateProjectModal';
import { Plus, Search } from 'lucide-react';
import { useClauses } from '../../hooks/useClauses';

interface ProjectsViewProps {
  projects: Project[];
  onAddProject: (p: Omit<Project, 'id'>) => void;
  onGoToDealEngine: () => void;
  onGoToClauseMatrix: () => void;
}

const ALL = 'All';
const STATUSES: (ProjectStatus | 'All')[] = [ALL, 'Draft', 'Analyzed', 'Negotiating', 'Closed'];
const SECTORS: (DealSector | 'All')[] = [ALL, 'Energy', 'M&A', 'Corporate Finance', 'General'];

export function ProjectsView({ projects, onAddProject, onGoToDealEngine, onGoToClauseMatrix }: ProjectsViewProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'All'>(ALL);
  const [sectorFilter, setSectorFilter] = useState<DealSector | 'All'>(ALL);
  const [search, setSearch] = useState('');

  const { clauses } = useClauses(selectedProject?.id);

  const filtered = projects.filter((p) => {
    if (statusFilter !== ALL && p.status !== statusFilter) return false;
    if (sectorFilter !== ALL && p.sector !== sectorFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (selectedProject) {
    return (
      <ProjectDetail
        project={selectedProject}
        clauses={clauses}
        onBack={() => setSelectedProject(null)}
        onGoToDealEngine={onGoToDealEngine}
        onGoToClauseMatrix={onGoToClauseMatrix}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={14} /> New Project
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <span className="text-gray-500 text-xs self-center mr-1">Status:</span>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              statusFilter === s
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {s}
          </button>
        ))}
        <span className="text-gray-500 text-xs self-center ml-3 mr-1">Sector:</span>
        {SECTORS.map((s) => (
          <button
            key={s}
            onClick={() => setSectorFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              sectorFilter === s
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((p) => (
          <ProjectCard key={p.id} project={p} onClick={() => setSelectedProject(p)} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <p>No projects match your filters.</p>
          </div>
        )}
      </div>

      <CreateProjectModal isOpen={showCreate} onClose={() => setShowCreate(false)} onSubmit={onAddProject} />
    </div>
  );
}
