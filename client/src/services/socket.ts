import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;

  // Initialize socket connection with JWT auth
  public connect(token: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    // Disconnect any stale socket before reconnecting
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: true,
      auth: { token },
    });

    this.socket.on('connect', () => {
      console.log('[⚡ Socket Connected]:', this.socket?.id);
    });

    this.socket.on('connect_error', (err) => {
      console.error('[⚡ Socket Auth Error]:', err.message);
    });

    this.socket.on('disconnect', () => {
      console.log('[⚡ Socket Disconnected]');
    });

    return this.socket;
  }

  // Get the raw socket instance
  public getSocket(): Socket | null {
    return this.socket;
  }

  // Join a channel room
  public joinChannel(channelId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('join_channel', channelId);
    }
  }

  // Leave a channel room
  public leaveChannel(channelId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('leave_channel', channelId);
    }
  }

  // Emit a real-time message
  public sendMessage(data: {
    channelId: string;
    workspaceId: string;
    content: string;
  }): void {
    if (this.socket?.connected) {
      this.socket.emit('send_message', data);
    }
  }

  // Send typing status
  public sendTypingStatus(channelId: string, userName: string, isTyping: boolean): void {
    if (this.socket?.connected) {
      this.socket.emit('typing', { channelId, userName, isTyping });
    }
  }

  // Listen for new incoming messages
  public onReceiveMessage(callback: (message: any) => void): void {
    if (this.socket) {
      this.socket.off('receive_message');
      this.socket.on('receive_message', callback);
    }
  }

  // Listen for real-time typing indicators
  public onUserTyping(callback: (data: { userName: string; isTyping: boolean }) => void): void {
    if (this.socket) {
      this.socket.off('user_typing');
      this.socket.on('user_typing', callback);
    }
  }

  // Listen for online user updates
  public onUserOnline(callback: (data: { userId: string }) => void): void {
    if (this.socket) {
      this.socket.off('user_online');
      this.socket.on('user_online', callback);
    }
  }

  public onUserOffline(callback: (data: { userId: string }) => void): void {
    if (this.socket) {
      this.socket.off('user_offline');
      this.socket.on('user_offline', callback);
    }
  }

  public onOnlineUsersList(callback: (userIds: string[]) => void): void {
    if (this.socket) {
      this.socket.off('online_users_list');
      this.socket.on('online_users_list', callback);
    }
  }

  public onMessageError(callback: (data: { error: string }) => void): void {
    if (this.socket) {
      this.socket.off('message_error');
      this.socket.on('message_error', callback);
    }
  }

  // Disconnect socket explicitly on user logout
  public disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
