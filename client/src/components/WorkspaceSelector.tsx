import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { WorkspaceModal } from './WorkspaceModal';

interface Workspace {
  id: string;
  name: string;
  slug: string;
  inviteCode: string;
}

interface WorkspaceSelectorProps {
  onSelectWorkspace: (workspace: Workspace) => void;
  selectedWorkspaceId?: string;
}

export const WorkspaceSelector: React.FC<WorkspaceSelectorProps> = ({
  onSelectWorkspace,
  selectedWorkspaceId,
}) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchWorkspaces = async () => {
    try {
      const data = await apiFetch<Workspace[]>('/workspaces');
      setWorkspaces(data);
      if (data.length > 0 && !selectedWorkspaceId) {
        onSelectWorkspace(data[0]);
      }
    } catch (err) {
      console.error('Failed to load workspaces', err);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  return (
    <div className="w-18 bg-slate-950 border-r border-slate-800 flex flex-col items-center py-4 gap-3">
      {workspaces.map((ws) => {
        const isSelected = ws.id === selectedWorkspaceId;
        const initial = ws.name.charAt(0).toUpperCase();

        return (
          <button
            key={ws.id}
            onClick={() => onSelectWorkspace(ws)}
            title={ws.name}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg transition-all duration-200 ${
              isSelected
                ? 'bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:rounded-xl'
            }`}
          >
            {initial}
          </button>
        );
      })}

      <button
        onClick={() => setIsModalOpen(true)}
        title="Add Workspace"
        className="w-12 h-12 rounded-2xl bg-slate-900 border border-dashed border-slate-700 text-slate-400 flex items-center justify-center text-xl font-bold hover:border-indigo-500 hover:text-indigo-400 hover:rounded-xl transition-all duration-200"
      >
        +
      </button>

      <WorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchWorkspaces}
      />
    </div>
  );
};
