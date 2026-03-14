import React from 'react';
import {
  LayoutDashboard,
  FolderOpen,
  Zap,
  Grid3X3,
  BookOpen,
  Bot,
  Settings,
} from 'lucide-react';

type View = 'portfolio' | 'projects' | 'dealEngine' | 'clauseMatrix' | 'templates' | 'agents' | 'settings';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: 'portfolio', label: 'Portfolio', icon: <LayoutDashboard size={18} /> },
  { id: 'projects', label: 'Projects', icon: <FolderOpen size={18} /> },
  { id: 'dealEngine', label: 'Deal Engine', icon: <Zap size={18} /> },
  { id: 'clauseMatrix', label: 'Clause Matrix', icon: <Grid3X3 size={18} /> },
  { id: 'templates', label: 'Templates', icon: <BookOpen size={18} /> },
  { id: 'agents', label: 'Agent Suite', icon: <Bot size={18} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
];

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <aside className="w-60 bg-gray-900 border-r border-gray-800 flex flex-col h-screen sticky top-0">
      <div className="px-5 py-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-sm">RD</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-sm tracking-wider">REAL DEAL</h1>
            <span className="text-emerald-400 text-xs font-medium">v2.0</span>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-500/20 border-l-2 border-emerald-500 text-emerald-400 pl-[10px]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="px-5 py-4 border-t border-gray-800">
        <p className="text-gray-600 text-xs">© 2025 Real Deal Platform</p>
      </div>
    </aside>
  );
}

export type { View };
