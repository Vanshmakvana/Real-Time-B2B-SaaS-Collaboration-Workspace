import React from 'react';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-xl p-8 shadow-2xl border border-slate-700 text-center">
        <h1 className="text-3xl font-bold text-indigo-400 mb-2">
          Infotact Workspace
        </h1>
        <p className="text-slate-400 mb-6">
          Real-Time B2B SaaS Collaboration Platform
        </p>
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Frontend Initialized (React 19 + Tailwind v4)
        </div>
      </div>
    </div>
  );
};

export default App;
