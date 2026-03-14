import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { Clause } from '../../types';

interface ClauseRiskChartProps {
  clauses: Clause[];
}

const riskColors: Record<string, string> = {
  Low: '#10b981',
  Medium: '#f59e0b',
  High: '#f43f5e',
};

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(n);

export function ClauseRiskChart({ clauses }: ClauseRiskChartProps) {
  const data = clauses.map((c) => ({
    x: c.mitigation,
    y: c.expectedValue,
    name: c.title,
    risk: c.riskLevel,
    fill: riskColors[c.riskLevel] || '#6b7280',
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="x"
            type="number"
            domain={[0, 1]}
            name="Mitigation"
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            label={{ value: 'Mitigation', position: 'insideBottom', offset: -5, fill: '#6b7280', fontSize: 11 }}
          />
          <YAxis
            dataKey="y"
            type="number"
            name="Expected Value"
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            tickFormatter={(v) => fmt(v)}
            width={70}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={(props: TooltipProps<number, string>) => {
              const { payload } = props;
              if (payload && payload.length) {
                const d = payload[0].payload as { name: string; x: number; y: number; risk: string };
                return (
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs">
                    <p className="text-white font-medium mb-1">{d.name}</p>
                    <p className="text-gray-400">Mitigation: {d.x.toFixed(2)}</p>
                    <p className="text-gray-400">Expected Value: {fmt(d.y)}</p>
                    <p style={{ color: riskColors[d.risk] }}>Risk: {d.risk}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter
            data={data}
            shape={(props: { cx?: number; cy?: number; payload?: { fill: string } }) => {
              const { cx = 0, cy = 0, payload } = props;
              return <circle cx={cx} cy={cy} r={6} fill={payload?.fill || '#6b7280'} fillOpacity={0.8} stroke="#fff" strokeWidth={0.5} />;
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
      <div className="flex gap-4 justify-center mt-2">
        {Object.entries(riskColors).map(([level, color]) => (
          <div key={level} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs text-gray-400">{level}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
