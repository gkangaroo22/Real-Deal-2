import React, { useState } from 'react';
import { Project, Clause } from '../../types';
import { AIScraperPanel } from './AIScraperPanel';
import { AIDraftingPanel } from './AIDraftingPanel';
import { RecursiveAuditPanel } from './RecursiveAuditPanel';
import { BatchProcessingPanel } from './BatchProcessingPanel';

interface DealEngineProps {
  projects: Project[];
  onClausesGenerated?: (clauses: Clause[], projectId: string) => void;
  initialTab?: number;
  initialDealType?: string;
}

const TABS = ['AI Scraper', 'AI Drafting', 'Recursive Audit', 'Batch Processing'];

export function DealEngine({ projects, onClausesGenerated, initialTab = 0, initialDealType }: DealEngineProps) {
  const [activeTab, setActiveTab] = useState(initialTab);

  function handleClausesGenerated(clauses: Clause[], projectId: string) {
    onClausesGenerated?.(clauses, projectId);
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-1 bg-gray-900/50 border border-gray-800 rounded-xl p-1">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === i
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && <AIScraperPanel onClausesExtracted={(clauses) => onClausesGenerated?.(clauses, '')} />}
      {activeTab === 1 && (
        <AIDraftingPanel
          projects={projects}
          preSelectedDealType={initialDealType}
          onClausesGenerated={handleClausesGenerated}
        />
      )}
      {activeTab === 2 && <RecursiveAuditPanel projects={projects} />}
      {activeTab === 3 && <BatchProcessingPanel />}
    </div>
  );
}
