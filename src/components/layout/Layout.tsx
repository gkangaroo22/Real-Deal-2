import React from 'react';
import { Sidebar, View } from './Sidebar';

interface LayoutProps {
  currentView: View;
  onViewChange: (view: View) => void;
  children: React.ReactNode;
  title: string;
}

const viewTitles: Record<View, string> = {
  portfolio: 'Portfolio Dashboard',
  projects: 'Projects',
  dealEngine: 'Deal Engine',
  clauseMatrix: 'Clause Matrix',
  templates: 'Template Library',
  agents: 'Agent Suite',
  settings: 'Settings',
};

export function Layout({ currentView, onViewChange, children, title }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar currentView={currentView} onViewChange={onViewChange} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 flex items-center px-6 sticky top-0 z-10">
          <h2 className="text-white font-semibold">{title || viewTitles[currentView]}</h2>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
