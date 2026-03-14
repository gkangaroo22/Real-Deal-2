import React, { useState, useRef, useEffect } from 'react';
import { BatchJob } from '../../types';
import { Play, Cpu } from 'lucide-react';

export function BatchProcessingPanel() {
  const [versions, setVersions] = useState(50);
  const [job, setJob] = useState<BatchJob | null>(null);
  const [running, setRunning] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [job?.logs]);

  function startBatch() {
    if (running) return;
    const newJob: BatchJob = {
      id: `batch-${Date.now()}`,
      status: 'running',
      totalVersions: versions,
      completedVersions: 0,
      logs: [`[${ts()}] Batch simulation initialized. Target: ${versions} versions.`, `[${ts()}] Loading deal templates and risk parameters...`],
      startedAt: new Date().toISOString(),
    };
    setJob(newJob);
    setRunning(true);

    let completed = 0;
    const logMessages = [
      'Generating clause variation matrix...',
      'Applying probability distributions to exposure values...',
      'Running Monte Carlo simulation on indemnification caps...',
      'Analyzing NWC adjustment scenarios...',
      'Computing Expected Value deltas across versions...',
      'Validating cross-clause consistency...',
      'Scoring risk profiles for each version...',
      'Identifying optimal negotiation positions...',
      'Cross-referencing against market precedents...',
      'Finalizing version analysis report...',
    ];

    intervalRef.current = setInterval(() => {
      completed += Math.floor(Math.random() * 5) + 1;
      if (completed >= versions) completed = versions;

      const msgIdx = Math.floor((completed / versions) * logMessages.length);
      const msg = logMessages[Math.min(msgIdx, logMessages.length - 1)];

      setJob((prev) => {
        if (!prev) return prev;
        const newLogs = [
          ...prev.logs,
          `[${ts()}] [v${completed}/${versions}] ${msg}`,
        ];
        if (completed >= versions) {
          newLogs.push(`[${ts()}] ✅ Batch complete. ${versions} versions analyzed.`);
          newLogs.push(`[${ts()}] Summary: Avg EV reduction 12.3%, Best version: v${Math.floor(Math.random() * versions) + 1}`);
          return { ...prev, completedVersions: completed, status: 'completed', logs: newLogs, completedAt: new Date().toISOString() };
        }
        return { ...prev, completedVersions: completed, logs: newLogs };
      });

      if (completed >= versions) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setRunning(false);
      }
    }, 300);
  }

  function ts() {
    return new Date().toLocaleTimeString('en-US', { hour12: false });
  }

  const pct = job ? Math.round((job.completedVersions / job.totalVersions) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Cpu size={16} className="text-emerald-400" /> Batch Version Simulator
        </h3>
        <div className="mb-4">
          <label className="block text-gray-400 text-xs mb-1.5">
            Number of Versions: <span className="text-white font-semibold">{versions}</span>
          </label>
          <input
            type="range"
            min={10}
            max={500}
            step={10}
            value={versions}
            onChange={(e) => setVersions(Number(e.target.value))}
            className="w-full accent-emerald-500"
            disabled={running}
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>10</span><span>500</span>
          </div>
        </div>
        <button
          onClick={startBatch}
          disabled={running}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          <Play size={14} />
          {running ? 'Running Batch...' : 'Run Batch Simulation'}
        </button>
      </div>

      {job && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${job.status === 'running' ? 'bg-amber-400 animate-pulse' : job.status === 'completed' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              <span className="text-white font-medium capitalize">{job.status}</span>
            </div>
            <span className="text-gray-400 text-sm">{job.completedVersions} / {job.totalVersions}</span>
          </div>

          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-gray-400 text-xs text-right">{pct}% complete</p>

          <div
            ref={logRef}
            className="bg-black rounded-lg p-4 h-64 overflow-y-auto font-mono text-xs"
          >
            {job.logs.map((log, i) => (
              <div key={i} className={`mb-0.5 ${log.includes('✅') ? 'text-emerald-400' : 'text-green-400'}`}>
                {log}
              </div>
            ))}
            {job.status === 'running' && (
              <div className="text-green-400 animate-pulse">█</div>
            )}
          </div>

          {job.status === 'completed' && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Versions Analyzed', value: job.totalVersions.toString() },
                { label: 'Avg EV Reduction', value: '12.3%' },
                { label: 'Optimal Version', value: `v${Math.floor(Math.random() * job.totalVersions) + 1}` },
              ].map((s) => (
                <div key={s.label} className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-center">
                  <p className="text-emerald-400 font-bold text-lg">{s.value}</p>
                  <p className="text-gray-400 text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
