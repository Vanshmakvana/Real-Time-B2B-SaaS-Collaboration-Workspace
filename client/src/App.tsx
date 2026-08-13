import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ToastProvider } from './context/ToastContext';
import { AuthPage } from './pages/AuthPage';
import { WorkspaceSelector } from './components/WorkspaceSelector';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { OnlineUsers } from './components/OnlineUsers';

interface Workspace {
  id: string;
  name: string;
  slug: string;
  inviteCode: string;
  members?: Array<{
    user: { id: string; name: string; email: string; avatar?: string } | string;
    role: 'admin' | 'member';
  }>;
}

interface Channel {
  id: string;
  name: string;
  isPrivate: boolean;
}

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  // When workspace changes, clear the selected channel
  const handleWorkspaceSelect = (ws: Workspace) => {
    if (ws.id !== selectedWorkspace?.id) {
      setSelectedChannel(null);
    }
    setSelectedWorkspace(ws);
  };

  return (
    <div className="min-h-screen h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
      {/* Workspace Icon Sidebar (far left) */}
      <WorkspaceSelector
        selectedWorkspaceId={selectedWorkspace?.id}
        onSelectWorkspace={handleWorkspaceSelect}
      />

      {/* Channel Sidebar (left panel) */}
      {selectedWorkspace && (
        <Sidebar
          workspaceId={selectedWorkspace.id}
          workspaceName={selectedWorkspace.name}
          selectedChannelId={selectedChannel?.id}
          onSelectChannel={(ch) => setSelectedChannel(ch)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-14 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/50 backdrop-blur-sm flex-shrink-0">
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
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-slate-400 font-medium">
                {user?.name}
              </span>
            </div>
            <button
              onClick={logout}
              className="text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg border border-red-500/20 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 flex overflow-hidden">
          {selectedWorkspace && selectedChannel ? (
            <>
              {/* Chat Window */}
              <ChatWindow
                channelId={selectedChannel.id}
                channelName={selectedChannel.name}
                workspaceId={selectedWorkspace.id}
                isPrivate={selectedChannel.isPrivate}
              />

              {/* Online Users Panel */}
              <OnlineUsers
                workspaceMembers={selectedWorkspace.members || []}
              />
            </>
          ) : (
            <main className="flex-1 flex items-center justify-center">
              {selectedWorkspace ? (
                <div className="text-center px-6">
                  <div className="text-5xl mb-4">💬</div>
                  <h2 className="text-xl font-semibold text-slate-300 mb-2">
                    Select a Channel
                  </h2>
                  <p className="text-sm text-slate-500 max-w-md">
                    Choose a channel from the sidebar to start collaborating with your team in{' '}
                    <span className="text-indigo-400 font-medium">{selectedWorkspace.name}</span>.
                  </p>
                </div>
              ) : (
                <div className="text-center px-6">
                  <div className="text-5xl mb-4">🚀</div>
                  <h2 className="text-xl font-semibold text-slate-300 mb-2">
                    Welcome to Infotact Workspace
                  </h2>
                  <p className="text-sm text-slate-500 max-w-md">
                    Create or select a workspace from the left sidebar to get started with your team collaboration.
                  </p>
                </div>
              )}
            </main>
          )}
        </div>
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
      <ToastProvider>
        <SocketProvider>
          <MainContent />
        </SocketProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
