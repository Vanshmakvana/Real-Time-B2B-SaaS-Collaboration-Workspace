import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';

interface OnlineUsersProps {
  workspaceMembers: Array<{
    user: { id: string; name: string; email: string; avatar?: string } | string;
    role: 'admin' | 'member';
  }>;
}

const getInitial = (name: string): string => {
  return name.charAt(0).toUpperCase();
};

const getAvatarColor = (name: string): string => {
  const colors = [
    'from-indigo-500 to-purple-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-cyan-500 to-blue-600',
    'from-violet-500 to-fuchsia-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const OnlineUsers: React.FC<OnlineUsersProps> = ({ workspaceMembers }) => {
  const { onUserOnline, onUserOffline, onOnlineUsersList } = useSocket();
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Receive initial online users list
    onOnlineUsersList((userIds) => {
      setOnlineUserIds(new Set(userIds));
    });

    // Track individual online/offline events
    onUserOnline(({ userId }) => {
      setOnlineUserIds((prev) => new Set(prev).add(userId));
    });

    onUserOffline(({ userId }) => {
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });
  }, [onUserOnline, onUserOffline, onOnlineUsersList]);

  // Parse members into displayable format
  const members = workspaceMembers
    .map((m) => {
      if (typeof m.user === 'string') {
        return { id: m.user, name: 'Unknown', email: '', role: m.role };
      }
      return { id: m.user.id, name: m.user.name, email: m.user.email, avatar: m.user.avatar, role: m.role };
    })
    .sort((a, b) => {
      // Online users first, then alphabetical
      const aOnline = onlineUserIds.has(a.id) ? 0 : 1;
      const bOnline = onlineUserIds.has(b.id) ? 0 : 1;
      if (aOnline !== bOnline) return aOnline - bOnline;
      return a.name.localeCompare(b.name);
    });

  const onlineCount = members.filter((m) => onlineUserIds.has(m.id)).length;

  return (
    <aside className="w-60 bg-slate-900/50 border-l border-slate-800 flex flex-col h-full panel-transition">
      {/* Header */}
      <div className="h-14 border-b border-slate-800 px-4 flex items-center gap-2">
        <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Members</h3>
        <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded-full font-bold">
          {onlineCount} online
        </span>
      </div>

      {/* Members List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-0.5">
        {members.map((member) => {
          const isOnline = onlineUserIds.has(member.id);
          return (
            <div
              key={member.id}
              className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              {/* Avatar with status dot */}
              <div className="relative flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(member.name)} flex items-center justify-center text-white text-xs font-bold ${
                    !isOnline ? 'opacity-50' : ''
                  }`}
                >
                  {getInitial(member.name)}
                </div>
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${
                    isOnline ? 'bg-emerald-500 pulse-online' : 'bg-slate-600'
                  }`}
                />
              </div>

              {/* Name & Role */}
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium truncate ${isOnline ? 'text-slate-200' : 'text-slate-500'}`}>
                  {member.name}
                </p>
                {member.role === 'admin' && (
                  <span className="text-[10px] text-amber-400/80 font-semibold uppercase">Admin</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
