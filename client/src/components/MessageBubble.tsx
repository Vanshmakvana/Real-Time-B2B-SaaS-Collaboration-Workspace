import React from 'react';

interface MessageBubbleProps {
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  isOwnMessage: boolean;
}

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

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
    'from-lime-500 to-green-600',
    'from-red-500 to-rose-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  senderName,
  senderAvatar,
  content,
  timestamp,
  isOwnMessage,
}) => {
  return (
    <div className={`message-enter flex gap-3 px-4 py-2 group hover:bg-slate-800/30 transition-colors ${isOwnMessage ? '' : ''}`}>
      {/* Avatar */}
      <div className="flex-shrink-0 pt-0.5">
        {senderAvatar ? (
          <img
            src={senderAvatar}
            alt={senderName}
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div
            className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarColor(senderName)} flex items-center justify-center text-white text-sm font-bold shadow-lg`}
          >
            {getInitial(senderName)}
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className={`text-sm font-semibold ${isOwnMessage ? 'text-indigo-400' : 'text-slate-200'}`}>
            {senderName}
          </span>
          <span className="text-[11px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
            {formatTime(timestamp)}
          </span>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed mt-0.5 break-words whitespace-pre-wrap">
          {content}
        </p>
      </div>
    </div>
  );
};
