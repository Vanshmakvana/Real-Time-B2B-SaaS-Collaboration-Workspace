import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

interface Channel {
  id: string;
  name: string;
  isPrivate: boolean;
}

interface SidebarProps {
  workspaceId: string;
  workspaceName: string;
  selectedChannelId?: string;
  onSelectChannel: (channel: Channel) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  workspaceId,
  workspaceName,
  selectedChannelId,
  onSelectChannel,
}) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChannels = async () => {
    try {
      const data = await apiFetch<Channel[]>(`/workspaces/${workspaceId}/channels`);
      setChannels(data);
      if (data.length > 0 && !selectedChannelId) {
        onSelectChannel(data[0]);
      }
    } catch (err: any) {
      console.error('Failed to load channels:', err);
    }
  };

  useEffect(() => {
    if (workspaceId) {
      fetchChannels();
    }
  }, [workspaceId]);

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await apiFetch(`/workspaces/${workspaceId}/channels`, {
        method: 'POST',
        body: JSON.stringify({ name: newChannelName, isPrivate }),
      });

      setNewChannelName('');
      setIsPrivate(false);
      setIsModalOpen(false);
      fetchChannels();
    } catch (err: any) {
      setError(err.message || 'Failed to create channel');
    }
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full">
      {/* Workspace Header */}
      <div className="h-14 border-b border-slate-800 px-4 flex items-center justify-between font-semibold text-slate-100">
        <span className="truncate">{workspaceName}</span>
      </div>

      {/* Channels List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-400 px-2 py-1">
          <span>Channels</span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="hover:text-indigo-400 transition-colors text-base font-bold"
            title="Create Channel"
          >
            +
          </button>
        </div>

        {channels.map((ch) => {
          const isSelected = ch.id === selectedChannelId;
          return (
            <button
              key={ch.id}
              onClick={() => onSelectChannel(ch)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isSelected
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <span className="text-slate-500">{ch.isPrivate ? '🔒' : '#'}</span>
              <span className="truncate">{ch.name}</span>
            </button>
          );
        })}
      </div>

      {/* Create Channel Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Create Channel</h3>

            {error && (
              <div className="mb-4 p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateChannel} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Channel Name
                </label>
                <input
                  type="text"
                  required
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder="e.g. announcements"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0"
                />
                <label htmlFor="isPrivate" className="text-sm text-slate-300">
                  Make channel private
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Create Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
};
