import React, { useState } from 'react';
import { Clause } from '../../types';
import { scrapeDocument } from '../../lib/gemini';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Badge } from '../ui/Badge';
import { Upload, FileText } from 'lucide-react';

interface AIScraperPanelProps {
  onClausesExtracted: (clauses: Clause[]) => void;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(n);

export function AIScraperPanel({ onClausesExtracted }: AIScraperPanelProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [clauses, setClauses] = useState<Clause[]>([]);

  async function handleExtract() {
    if (!text.trim()) return;
    setLoading(true);
    const result = await scrapeDocument(text);
    setClauses(result);
    onClausesExtracted(result);
    setLoading(false);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setText(ev.target?.result as string);
    };
    reader.readAsText(file);
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <FileText size={16} className="text-emerald-400" /> Document Ingestion
        </h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste legal document text here for AI clause extraction..."
          className="w-full h-48 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 resize-none"
        />
        <div className="flex items-center gap-3 mt-3">
          <label className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors">
            <Upload size={14} />
            Upload .txt file
            <input type="file" accept=".txt,.md" onChange={handleFileUpload} className="hidden" />
          </label>
          <button
            onClick={handleExtract}
            disabled={!text.trim() || loading}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? <LoadingSpinner size="sm" /> : null}
            {loading ? 'Extracting...' : 'Extract Clauses'}
          </button>
        </div>
      </div>

      {clauses.length > 0 && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Extracted Clauses ({clauses.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-gray-400 font-medium pb-3 pr-4">Title</th>
                  <th className="text-center text-gray-400 font-medium pb-3 px-2">P</th>
                  <th className="text-center text-gray-400 font-medium pb-3 px-2">E</th>
                  <th className="text-center text-gray-400 font-medium pb-3 px-2">M</th>
                  <th className="text-center text-gray-400 font-medium pb-3 px-2">EV</th>
                  <th className="text-center text-gray-400 font-medium pb-3 px-2">Risk</th>
                </tr>
              </thead>
              <tbody>
                {clauses.map((c) => (
                  <tr key={c.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 pr-4 text-white font-medium">{c.title}</td>
                    <td className="py-3 px-2 text-center text-gray-300">{(c.probability * 100).toFixed(0)}%</td>
                    <td className="py-3 px-2 text-center text-gray-300">{fmt(c.exposure)}</td>
                    <td className="py-3 px-2 text-center text-gray-300">{(c.mitigation * 100).toFixed(0)}%</td>
                    <td className="py-3 px-2 text-center text-rose-400">{fmt(c.expectedValue)}</td>
                    <td className="py-3 px-2 text-center"><Badge variant={c.riskLevel} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
