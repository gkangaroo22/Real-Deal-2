import React from 'react';
import { RiskLevel, ProjectStatus } from '../../types';

type BadgeVariant = RiskLevel | ProjectStatus | string;

const variantStyles: Record<string, string> = {
  Low: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  Medium: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  High: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
  Draft: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
  Analyzed: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  Negotiating: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  Closed: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  Energy: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  'M&A': 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  'Corporate Finance': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  General: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
  Finance: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
};

interface BadgeProps {
  variant: BadgeVariant;
  children?: React.ReactNode;
}

export function Badge({ variant, children }: BadgeProps) {
  const style = variantStyles[variant] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {children ?? variant}
    </span>
  );
}
