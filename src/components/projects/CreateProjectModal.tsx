import React, { useState } from 'react';
import { Project, DealSector, ProjectStatus } from '../../types';
import { Modal } from '../ui/Modal';
import { X, Plus } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: Omit<Project, 'id'>) => void;
}

const SECTORS: DealSector[] = ['Energy', 'M&A', 'Corporate Finance', 'General'];

export function CreateProjectModal({ isOpen, onClose, onSubmit }: CreateProjectModalProps) {
  const [name, setName] = useState('');
  const [sector, setSector] = useState<DealSector>('M&A');
  const [dealSize, setDealSize] = useState('');
  const [closingDate, setClosingDate] = useState('');
  const [description, setDescription] = useState('');
  const [parties, setParties] = useState<string[]>(['']);
  const [status] = useState<ProjectStatus>('Draft');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      name,
      sector,
      dealSize: parseFloat(dealSize) || 0,
      closingDate,
      description,
      parties: parties.filter(Boolean),
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expectedRiskValue: Math.round((parseFloat(dealSize) || 0) * 0.05),
    });
    setName('');
    setSector('M&A');
    setDealSize('');
    setClosingDate('');
    setDescription('');
    setParties(['']);
    onClose();
  }

  function addParty() {
    setParties((prev) => [...prev, '']);
  }

  function updateParty(i: number, val: string) {
    setParties((prev) => prev.map((p, idx) => (idx === i ? val : p)));
  }

  function removeParty(i: number) {
    setParties((prev) => prev.filter((_, idx) => idx !== i));
  }

  const inputCls = 'w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors';
  const labelCls = 'block text-gray-300 text-sm font-medium mb-1.5';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Project" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelCls}>Project Name *</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="e.g., Atlas Corp Acquisition" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Sector *</label>
            <select value={sector} onChange={(e) => setSector(e.target.value as DealSector)} className={inputCls}>
              {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Deal Size ($) *</label>
            <input required type="number" value={dealSize} onChange={(e) => setDealSize(e.target.value)} className={inputCls} placeholder="45000000" />
          </div>
        </div>
        <div>
          <label className={labelCls}>Expected Closing Date *</label>
          <input required type="date" value={closingDate} onChange={(e) => setClosingDate(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputCls} h-20 resize-none`} placeholder="Brief deal description..." />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={labelCls.replace(' mb-1.5', '')}>Parties</label>
            <button type="button" onClick={addParty} className="text-emerald-400 hover:text-emerald-300 text-xs flex items-center gap-1">
              <Plus size={12} /> Add Party
            </button>
          </div>
          <div className="space-y-2">
            {parties.map((p, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={p}
                  onChange={(e) => updateParty(i, e.target.value)}
                  className={inputCls}
                  placeholder={`Party ${i + 1} name`}
                />
                {parties.length > 1 && (
                  <button type="button" onClick={() => removeParty(i)} className="text-gray-500 hover:text-rose-400 p-2">
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2.5 rounded-lg text-sm font-medium transition-colors">
            Cancel
          </button>
          <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
            Create Project
          </button>
        </div>
      </form>
    </Modal>
  );
}
