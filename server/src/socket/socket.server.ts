import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { MessageModel } from '../models/Message';

export const initializeSocket = (httpServer: HttpServer): Server => {
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`[⚡ Socket Connected]: ${socket.id}`);

    // Join a specific channel room
    socket.on('join_channel', (channelId: string) => {
      socket.join(channelId);
      console.log(`[Socket ${socket.id}] joined room: ${channelId}`);
    });

    // Leave a channel room
    socket.on('leave_channel', (channelId: string) => {
      socket.leave(channelId);
    });

    // Handle incoming message broadcast & MongoDB persistence
    socket.on('send_message', async (data: {
      senderId: string;
      channelId: string;
      workspaceId: string;
      content: string;
    }) => {
      try {
        const { senderId, channelId, workspaceId, content } = data;

        const newMessage = await MessageModel.create({
          sender: senderId,
          channel: channelId,
          workspace: workspaceId,
          content,
        });

        const populatedMessage = await newMessage.populate('sender', 'name email avatar');

        // Broadcast message to everyone currently in the channel room
        io.to(channelId).emit('receive_message', populatedMessage);
      } catch (error) {
        console.error('[Socket Message Error]:', error);
      }
    });

    // Handle real-time typing indicators
    socket.on('typing', (data: { channelId: string; userName: string; isTyping: boolean }) => {
      socket.to(data.channelId).emit('user_typing', data);
    });

    socket.on('disconnect', () => {
      console.log(`[⚡ Socket Disconnected]: ${socket.id}`);
    });
  });

  return io;
};
