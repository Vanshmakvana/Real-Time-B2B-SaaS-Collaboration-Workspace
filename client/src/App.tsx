import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { WorkspaceSelector } from './components/WorkspaceSelector';

interface Workspace {
  id: string;
  name: string;
  slug: string;
  inviteCode: string;
}

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
      {/* Workspace Sidebar */}
      <WorkspaceSelector
        selectedWorkspaceId={selectedWorkspace?.id}
        onSelectWorkspace={(ws) => setSelectedWorkspace(ws)}
      />

      {/* Main Workspace View */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-14 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/50 backdrop-blur">
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-slate-100 text-lg">
              {selectedWorkspace ? selectedWorkspace.name : 'Select a Workspace'}
            </h1>
            {selectedWorkspace && (
              <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-md font-mono border border-slate-700">
                Code: {selectedWorkspace.inviteCode}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400 font-medium">
              {user?.name}
            </span>
            <button
              onClick={logout}
              className="text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg border border-red-500/20 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Workspace Body Placeholder */}
        <main className="flex-1 p-6 flex items-center justify-center">
          {selectedWorkspace ? (
            <div className="text-center text-slate-500">
              <p className="text-lg font-medium text-slate-400 mb-1">
                Active Workspace: <span className="text-indigo-400">{selectedWorkspace.name}</span>
              </p>
              <p className="text-sm">Channel sidebar and chat window will be integrated in Week 3.</p>
            </div>
          ) : (
            <p className="text-slate-500">Create or select a workspace from the left bar to get started.</p>
          )}
        </main>
      </div>
    </div>
  );
};

const MainContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <DashboardLayout /> : <AuthPage />;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
};

export default App;
