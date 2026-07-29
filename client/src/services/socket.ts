import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;

  // Initialize socket connection
  public connect(): Socket {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        withCredentials: true,
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        console.log('[⚡ Socket Connected]:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('[⚡ Socket Disconnected]');
      });
    }
    return this.socket;
  }

  // Join a channel room
  public joinChannel(channelId: string): void {
    if (this.socket) {
      this.socket.emit('join_channel', channelId);
    }
  }

  // Leave a channel room
  public leaveChannel(channelId: string): void {
    if (this.socket) {
      this.socket.emit('leave_channel', channelId);
    }
  }

  // Emit a real-time message
  public sendMessage(data: {
    senderId: string;
    channelId: string;
    workspaceId: string;
    content: string;
  }): void {
    if (this.socket) {
      this.socket.emit('send_message', data);
    }
  }

  // Send typing status
  public sendTypingStatus(channelId: string, userName: string, isTyping: boolean): void {
    if (this.socket) {
      this.socket.emit('typing', { channelId, userName, isTyping });
    }
  }

  // Listen for new incoming messages
  public onReceiveMessage(callback: (message: any) => void): void {
    if (this.socket) {
      this.socket.off('receive_message'); // Avoid duplicate listeners
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

  // Disconnect socket explicitly on user logout
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
