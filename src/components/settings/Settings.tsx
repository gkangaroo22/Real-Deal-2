import React, { useState } from 'react';
import { Key, Database, Bell, Download, Upload, Eye, EyeOff } from 'lucide-react';

const isFirebaseConfigured = () =>
  !!(import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID);

export function Settings() {
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [geminiKey, setGeminiKey] = useState('');
  const [notifications, setNotifications] = useState({ email: true, browser: false, deals: true });

  const inputCls = 'w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors';

  return (
    <div className="max-w-2xl space-y-6">
      {/* API Configuration */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Key size={16} className="text-emerald-400" /> API Configuration
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-xs mb-1.5">Gemini API Key</label>
            <div className="relative">
              <input
                type={showGeminiKey ? 'text' : 'password'}
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="Enter your Gemini API key..."
                className={`${inputCls} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowGeminiKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showGeminiKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <p className="text-gray-600 text-xs mt-1">Used for AI clause generation and document auditing.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Firebase API Key', placeholder: 'VITE_FIREBASE_API_KEY' },
              { label: 'Firebase Project ID', placeholder: 'your-project-id' },
              { label: 'Auth Domain', placeholder: 'project.firebaseapp.com' },
              { label: 'Storage Bucket', placeholder: 'project.appspot.com' },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-gray-400 text-xs mb-1.5">{f.label}</label>
                <input type="password" placeholder={f.placeholder} className={inputCls} />
              </div>
            ))}
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Save API Configuration
          </button>
        </div>
      </div>

      {/* Firebase Config */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Database size={16} className="text-blue-400" /> Database Status
        </h3>
        <div className="flex items-center gap-3 mb-4">
          {isFirebaseConfigured() ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-emerald-400 text-sm">Connected to Firebase</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-400 text-sm">Using local mock data — Firebase not configured</span>
            </>
          )}
        </div>
        <p className="text-gray-500 text-xs">
          Configure Firebase credentials in your <code className="text-emerald-400 bg-gray-800 px-1 py-0.5 rounded">.env</code> file to enable persistent cloud storage. See <code className="text-emerald-400 bg-gray-800 px-1 py-0.5 rounded">.env.example</code> for required variables.
        </p>
      </div>

      {/* Notifications */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Bell size={16} className="text-purple-400" /> Notifications
        </h3>
        <div className="space-y-3">
          {[
            { key: 'email', label: 'Email notifications', desc: 'Receive deal update emails' },
            { key: 'browser', label: 'Browser notifications', desc: 'Get in-app alerts' },
            { key: 'deals', label: 'Deal activity alerts', desc: 'Notify on clause changes' },
          ].map((n) => (
            <label key={n.key} className="flex items-center justify-between cursor-pointer group">
              <div>
                <p className="text-white text-sm">{n.label}</p>
                <p className="text-gray-500 text-xs">{n.desc}</p>
              </div>
              <div
                onClick={() => setNotifications((prev) => ({ ...prev, [n.key]: !prev[n.key as keyof typeof prev] }))}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  notifications[n.key as keyof typeof notifications] ? 'bg-emerald-600' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
                    notifications[n.key as keyof typeof notifications] ? 'left-5' : 'left-0.5'
                  }`}
                />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">Data Management</h3>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors">
            <Download size={14} /> Export Data
          </button>
          <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors">
            <Upload size={14} /> Import Data
          </button>
        </div>
        <p className="text-gray-600 text-xs mt-3">Export all projects and clauses as JSON for backup or migration.</p>
      </div>
    </div>
  );
}
