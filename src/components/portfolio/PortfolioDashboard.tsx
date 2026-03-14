import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Project, Clause } from '../../types';
import { ProjectCard } from './ProjectCard';
import { ClauseRiskChart } from '../clauseMatrix/ClauseRiskChart';
import { TrendingUp, AlertTriangle, Briefcase, Calendar } from 'lucide-react';

interface PortfolioDashboardProps {
  projects: Project[];
  allClauses: Clause[];
  onProjectClick: (project: Project) => void;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(n);

const SECTOR_COLORS: Record<string, string> = {
  Energy: '#f59e0b',
  'M&A': '#a855f7',
  'Corporate Finance': '#3b82f6',
  General: '#6b7280',
};

const STATUS_ORDER: Record<string, number> = { Draft: 0, Analyzed: 1, Negotiating: 2, Closed: 3 };

export function PortfolioDashboard({ projects, allClauses, onProjectClick }: PortfolioDashboardProps) {
  const totalValue = projects.reduce((s, p) => s + p.dealSize, 0);
  const totalRisk = projects.reduce((s, p) => s + p.expectedRiskValue, 0);
  const activeCount = projects.filter((p) => p.status !== 'Closed').length;

  const sectorData = Object.entries(
    projects.reduce<Record<string, number>>((acc, p) => {
      acc[p.sector] = (acc[p.sector] || 0) + p.dealSize;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const upcoming = [...projects]
    .filter((p) => p.status !== 'Closed')
    .sort((a, b) => new Date(a.closingDate).getTime() - new Date(b.closingDate).getTime())
    .slice(0, 5);

  const recent = [...projects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4);

  const statCards = [
    {
      label: 'Total Portfolio Value',
      value: fmt(totalValue),
      icon: <TrendingUp size={20} className="text-emerald-400" />,
      color: 'text-emerald-400',
    },
    {
      label: 'Risk Exposure',
      value: fmt(totalRisk),
      icon: <AlertTriangle size={20} className="text-rose-400" />,
      color: 'text-rose-400',
    },
    {
      label: 'Active Projects',
      value: activeCount.toString(),
      icon: <Briefcase size={20} className="text-blue-400" />,
      color: 'text-blue-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">{s.label}</span>
              {s.icon}
            </div>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sector Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
        >
          <h3 className="text-white font-semibold mb-4">Sector Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {sectorData.map((entry) => (
                    <Cell key={entry.name} fill={SECTOR_COLORS[entry.name] || '#6b7280'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [fmt(v), 'Value']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Transaction Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Calendar size={16} className="text-emerald-400" /> Upcoming Closings
          </h3>
          <div className="space-y-3">
            {upcoming.length === 0 && (
              <p className="text-gray-500 text-sm">No upcoming closings.</p>
            )}
            {upcoming.map((p) => (
              <div
                key={p.id}
                onClick={() => onProjectClick(p)}
                className="flex items-center justify-between cursor-pointer hover:bg-white/5 rounded-lg p-2 -mx-2 transition-colors"
              >
                <div>
                  <p className="text-white text-sm font-medium">{p.name}</p>
                  <p className="text-gray-500 text-xs">{new Date(p.closingDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 text-sm font-semibold">{fmt(p.dealSize)}</p>
                  <p className="text-gray-500 text-xs">{p.status}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Risk Scatter Chart */}
      {allClauses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
        >
          <h3 className="text-white font-semibold mb-4">Risk Overview — Mitigation vs. Expected Value</h3>
          <ClauseRiskChart clauses={allClauses} />
        </motion.div>
      )}

      {/* Recent Projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-white font-semibold mb-4">Recent Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recent.map((p) => (
            <ProjectCard key={p.id} project={p} onClick={() => onProjectClick(p)} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
