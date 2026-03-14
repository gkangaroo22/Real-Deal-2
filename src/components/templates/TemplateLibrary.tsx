import React, { useState } from 'react';
import { Template } from '../../types';
import { Badge } from '../ui/Badge';
import { BookOpen, ChevronRight } from 'lucide-react';

interface TemplateLibraryProps {
  onUseTemplate: (template: Template) => void;
}

const TEMPLATES: Template[] = [
  // Energy
  { id: 't1', name: 'Tax Credit Transfer Agreement (TCTA)', sector: 'Energy', category: 'Energy', description: 'IRS Section 6418 compliant transfer of ITCs and PTCs for renewable energy facilities.', clauses: ['Credit Transfer', 'Recapture Indemnification', 'Qualifying Property', 'True-Up Mechanism'] },
  { id: 't2', name: 'Power Purchase Agreement', sector: 'Energy', category: 'Energy', description: 'Long-term electricity offtake agreement with fixed and floating price components.', clauses: ['Offtake Obligation', 'Force Majeure', 'Curtailment', 'Interconnection'] },
  { id: 't3', name: 'Mineral Rights Transfer', sector: 'Energy', category: 'Energy', description: 'Conveyance of subsurface mineral rights with royalty and working interest provisions.', clauses: ['Royalty Structure', 'Decommissioning', 'Environmental Liability', 'Surface Use'] },
  { id: 't4', name: 'Energy Offtake Agreement', sector: 'Energy', category: 'Energy', description: 'Binding commitment to purchase energy output over a defined contract term.', clauses: ['Volume Commitment', 'Price Escalation', 'Delivery Conditions', 'Default Remedies'] },
  // M&A
  { id: 't5', name: 'Purchase and Sale Agreement (PSA)', sector: 'M&A', category: 'M&A', description: 'Comprehensive asset purchase structure with reps, warranties, and closing conditions.', clauses: ['Purchase Price', 'Representations', 'Conditions to Closing', 'Indemnification'] },
  { id: 't6', name: 'Asset Purchase Agreement (APA)', sector: 'M&A', category: 'M&A', description: 'Targeted acquisition of specified assets with assumption of selected liabilities.', clauses: ['Acquired Assets', 'Excluded Assets', 'Assumed Liabilities', 'Purchase Price Allocation'] },
  { id: 't7', name: 'Stock Purchase Agreement (SPA)', sector: 'M&A', category: 'M&A', description: 'Full equity acquisition with comprehensive due diligence and closing mechanics.', clauses: ['Share Transfer', 'NWC Adjustment', 'Escrow', 'Non-Compete'] },
  { id: 't8', name: 'Merger Agreement', sector: 'M&A', category: 'M&A', description: 'Statutory merger structure with board approval and shareholder vote requirements.', clauses: ['Merger Mechanics', 'Board Recommendations', 'No-Shop', 'Termination Fee'] },
  { id: 't9', name: 'LOI for Acquisition', sector: 'M&A', category: 'M&A', description: 'Non-binding letter of intent outlining key deal terms and exclusivity period.', clauses: ['Proposed Valuation', 'Exclusivity', 'Conditions', 'Confidentiality'] },
  { id: 't10', name: 'Term Sheet (M&A)', sector: 'M&A', category: 'M&A', description: 'Binding and non-binding term summary for M&A transactions.', clauses: ['Deal Structure', 'Economics', 'Governance', 'Timeline'] },
  // Corporate
  { id: 't11', name: 'Operating Agreement (LLC)', sector: 'Corporate Finance', category: 'Corporate', description: 'Comprehensive LLC governance framework including manager authority and distributions.', clauses: ['Capital Contributions', 'Distributions', 'Management Rights', 'Transfer Restrictions'] },
  { id: 't12', name: 'Corporate Bylaws', sector: 'Corporate Finance', category: 'Corporate', description: 'Foundational governance document governing board and shareholder proceedings.', clauses: ['Board Composition', 'Voting Rights', 'Officer Authority', 'Amendment Procedure'] },
  { id: 't13', name: 'Board Resolution', sector: 'Corporate Finance', category: 'Corporate', description: 'Formal board authorization for major corporate transactions and decisions.', clauses: ['Authorization', 'Officer Delegation', 'Ratification', 'Effective Date'] },
  { id: 't14', name: 'Shareholder Agreement', sector: 'Corporate Finance', category: 'Corporate', description: 'Rights and obligations among equity holders including drag-along and tag-along.', clauses: ['Drag-Along', 'Tag-Along', 'ROFR', 'Anti-Dilution'] },
  { id: 't15', name: 'Employment Agreement (Key Person)', sector: 'Corporate Finance', category: 'Corporate', description: 'Executive employment contract with compensation, equity, and restrictive covenants.', clauses: ['Compensation', 'Equity Grant', 'Non-Compete', 'Severance'] },
  { id: 't16', name: 'Equity Incentive Plan', sector: 'Corporate Finance', category: 'Corporate', description: 'Stock option and restricted stock unit framework for employee compensation.', clauses: ['Award Types', 'Vesting Schedule', 'Exercise Rights', 'Change of Control'] },
  // Finance
  { id: 't17', name: 'Escrow Agreement', sector: 'Finance', category: 'Finance', description: 'Third-party escrow arrangement for deal holdbacks and indemnification reserves.', clauses: ['Escrow Amount', 'Release Conditions', 'Dispute Resolution', 'Escrow Agent Fees'] },
  { id: 't18', name: 'Promissory Note', sector: 'Finance', category: 'Finance', description: 'Debt instrument with repayment schedule, interest rate, and default provisions.', clauses: ['Principal Amount', 'Interest Rate', 'Repayment Schedule', 'Events of Default'] },
  { id: 't19', name: 'Security Agreement', sector: 'Finance', category: 'Finance', description: 'Collateral pledge and UCC security interest perfection agreement.', clauses: ['Collateral Description', 'Security Interest Grant', 'Covenants', 'Remedies'] },
  { id: 't20', name: 'Loan Agreement', sector: 'Finance', category: 'Finance', description: 'Comprehensive credit facility agreement with financial covenants and conditions.', clauses: ['Credit Facility', 'Conditions Precedent', 'Financial Covenants', 'Events of Default'] },
  // General
  { id: 't21', name: 'Non-Disclosure Agreement (NDA)', sector: 'General', category: 'General', description: 'Mutual or one-way confidentiality agreement for deal and business discussions.', clauses: ['Confidential Information', 'Permitted Disclosures', 'Term', 'Remedies'] },
  { id: 't22', name: 'Letter of Intent (LOI)', sector: 'General', category: 'General', description: 'Preliminary agreement outlining key terms and transaction framework.', clauses: ['Intent', 'Key Terms', 'Exclusivity', 'Governing Law'] },
  { id: 't23', name: 'Term Sheet', sector: 'General', category: 'General', description: 'Summary of proposed deal terms serving as the basis for definitive documentation.', clauses: ['Transaction Overview', 'Economic Terms', 'Governance', 'Conditions'] },
  { id: 't24', name: 'Consulting Agreement', sector: 'General', category: 'General', description: 'Independent contractor engagement with scope, payment, and IP assignment terms.', clauses: ['Scope of Services', 'Compensation', 'IP Assignment', 'Non-Solicitation'] },
];

const CATEGORIES = ['All', 'Energy', 'M&A', 'Corporate', 'Finance', 'General'];

export function TemplateLibrary({ onUseTemplate }: TemplateLibraryProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = TEMPLATES.filter((t) => {
    if (activeCategory !== 'All' && t.category !== activeCategory) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search templates..."
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 w-48"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => (
          <div key={t.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-emerald-500/50 transition-all duration-200 group flex flex-col">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen size={14} className="text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm leading-tight mb-1 group-hover:text-emerald-400 transition-colors">{t.name}</h3>
                <Badge variant={t.category} />
              </div>
            </div>
            <p className="text-gray-400 text-xs mb-4 flex-1">{t.description}</p>
            <div className="mb-4">
              <p className="text-gray-500 text-xs mb-2">Key Clauses:</p>
              <div className="flex flex-wrap gap-1">
                {t.clauses.map((c) => (
                  <span key={c} className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded">
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => onUseTemplate(t)}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 hover:border-emerald-500 text-emerald-400 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            >
              Use Template <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">No templates match your search.</div>
      )}
    </div>
  );
}
