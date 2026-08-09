import React, { createContext, useContext, useEffect, useRef } from 'react';
import { socketService } from '../services/socket';
import { useAuth } from './AuthContext';

interface SocketContextType {
  joinChannel: (channelId: string) => void;
  leaveChannel: (channelId: string) => void;
  sendMessage: (data: { channelId: string; workspaceId: string; content: string }) => void;
  sendTyping: (channelId: string, userName: string, isTyping: boolean) => void;
  onReceiveMessage: (callback: (message: any) => void) => void;
  onUserTyping: (callback: (data: { userName: string; isTyping: boolean }) => void) => void;
  onUserOnline: (callback: (data: { userId: string }) => void) => void;
  onUserOffline: (callback: (data: { userId: string }) => void) => void;
  onOnlineUsersList: (callback: (userIds: string[]) => void) => void;
  onMessageError: (callback: (data: { error: string }) => void) => void;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const connectedRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated && token) {
      socketService.connect(token);
      connectedRef.current = true;
    } else {
      socketService.disconnect();
      connectedRef.current = false;
    }

    return () => {
      socketService.disconnect();
      connectedRef.current = false;
    };
  }, [isAuthenticated, token]);

  const value: SocketContextType = {
    joinChannel: (channelId) => socketService.joinChannel(channelId),
    leaveChannel: (channelId) => socketService.leaveChannel(channelId),
    sendMessage: (data) => socketService.sendMessage(data),
    sendTyping: (channelId, userName, isTyping) =>
      socketService.sendTypingStatus(channelId, userName, isTyping),
    onReceiveMessage: (cb) => socketService.onReceiveMessage(cb),
    onUserTyping: (cb) => socketService.onUserTyping(cb),
    onUserOnline: (cb) => socketService.onUserOnline(cb),
    onUserOffline: (cb) => socketService.onUserOffline(cb),
    onOnlineUsersList: (cb) => socketService.onOnlineUsersList(cb),
    onMessageError: (cb) => socketService.onMessageError(cb),
    isConnected: connectedRef.current,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
