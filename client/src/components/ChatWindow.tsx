import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useToast } from '../context/ToastContext';
import { apiFetch } from '../services/api';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import type { Message, PaginatedMessages } from '../types';

interface ChatWindowProps {
  channelId: string;
  channelName: string;
  workspaceId: string;
  isPrivate: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  channelId,
  channelName,
  workspaceId,
  isPrivate,
}) => {
  const { user } = useAuth();
  const { joinChannel, leaveChannel, sendMessage, sendTyping, onReceiveMessage, onUserTyping, onMessageError } = useSocket();
  const { showToast } = useToast();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevChannelRef = useRef<string | null>(null);

  // Scroll to bottom of messages
  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'instant',
    });
  }, []);

  // Load message history from REST API
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      setMessages([]);
      setTypingUsers([]);

      try {
        const data = await apiFetch<PaginatedMessages>(
          `/workspaces/${workspaceId}/channels/${channelId}/messages?limit=50`
        );
        setMessages(data.messages);
        // Scroll to bottom after initial load
        setTimeout(() => scrollToBottom(false), 50);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load messages';
        showToast(message, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [channelId, workspaceId, showToast, scrollToBottom]);

  // Join/leave channel rooms via Socket.IO
  useEffect(() => {
    // Leave the previous channel
    if (prevChannelRef.current && prevChannelRef.current !== channelId) {
      leaveChannel(prevChannelRef.current);
    }

    // Join the new channel
    joinChannel(channelId);
    prevChannelRef.current = channelId;

    return () => {
      leaveChannel(channelId);
    };
  }, [channelId, joinChannel, leaveChannel]);

  // Listen for incoming messages via socket
  useEffect(() => {
    onReceiveMessage((message: Message) => {
      setMessages((prev) => {
        // Deduplicate by id
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
      setTimeout(() => scrollToBottom(true), 50);
    });

    onMessageError(({ error }) => {
      showToast(error, 'error');
      setIsSending(false);
    });

    return () => {
      // Cleanup handled by socketService's off() calls in the next registration
    };
  }, [onReceiveMessage, onMessageError, showToast, scrollToBottom]);

  // Listen for typing events
  useEffect(() => {
    onUserTyping(({ userName, isTyping }) => {
      setTypingUsers((prev) => {
        if (isTyping && !prev.includes(userName)) {
          return [...prev, userName];
        }
        if (!isTyping) {
          return prev.filter((u) => u !== userName);
        }
        return prev;
      });
    });
  }, [onUserTyping]);

  // Handle message send
  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed || !user || isSending) return;

    setIsSending(true);
    sendMessage({
      channelId,
      workspaceId,
      content: trimmed,
    });

    setInputValue('');
    setIsSending(false);

    // Stop typing indicator
    if (user.name) {
      sendTyping(channelId, user.name, false);
    }

    // Refocus input
    inputRef.current?.focus();
  }, [inputValue, user, isSending, channelId, workspaceId, sendMessage, sendTyping]);

  // Handle input change with typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);

    if (user?.name) {
      sendTyping(channelId, user.name, true);

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        sendTyping(channelId, user.name, false);
      }, 2000);
    }
  };

  // Handle Enter key (send) / Shift+Enter (newline)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Determine if a message is from the current user
  const isOwnMessage = (message: Message): boolean => {
    if (typeof message.sender === 'string') {
      return message.sender === user?.id;
    }
    return message.sender.id === user?.id;
  };

  // Get sender name from a message
  const getSenderName = (message: Message): string => {
    if (typeof message.sender === 'string') return 'Unknown';
    return message.sender.name;
  };

  // Get sender avatar from a message
  const getSenderAvatar = (message: Message): string | undefined => {
    if (typeof message.sender === 'string') return undefined;
    return message.sender.avatar;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950">
      {/* Channel Header */}
      <div className="h-12 border-b border-slate-800 px-5 flex items-center gap-3 bg-slate-900/30 backdrop-blur-sm flex-shrink-0">
        <span className="text-slate-500 text-lg">{isPrivate ? '🔒' : '#'}</span>
        <h2 className="font-semibold text-slate-100 text-sm">{channelName}</h2>
        <div className="h-4 w-px bg-slate-700" />
        <span className="text-xs text-slate-500">
          {messages.length} message{messages.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" />
              </div>
              <span className="text-sm text-slate-500">Loading messages...</span>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center px-6">
              <div className="text-4xl mb-3">{isPrivate ? '🔒' : '💬'}</div>
              <h3 className="text-lg font-semibold text-slate-300 mb-1">
                Welcome to #{channelName}
              </h3>
              <p className="text-sm text-slate-500 max-w-sm">
                This is the start of the <span className="text-indigo-400">#{channelName}</span> channel.
                Send a message to begin the conversation.
              </p>
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-0.5">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                senderName={getSenderName(message)}
                senderAvatar={getSenderAvatar(message)}
                content={message.content}
                timestamp={message.createdAt}
                isOwnMessage={isOwnMessage(message)}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Typing Indicator */}
      <TypingIndicator typingUsers={typingUsers} />

      {/* Message Input */}
      <div className="px-4 pb-4 pt-1 flex-shrink-0">
        <div className="flex items-end gap-2 bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-2.5 focus-within:border-indigo-500/50 transition-colors">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={`Message #${channelName}`}
            rows={1}
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 resize-none text-sm focus:outline-none max-h-32 leading-relaxed"
            style={{
              height: 'auto',
              minHeight: '24px',
              maxHeight: '128px',
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 128) + 'px';
            }}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isSending}
            className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white flex items-center justify-center transition-all duration-150 disabled:cursor-not-allowed"
            title="Send message"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-slate-600 mt-1 px-1">
          Press <kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-400">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-400">Shift + Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
};
