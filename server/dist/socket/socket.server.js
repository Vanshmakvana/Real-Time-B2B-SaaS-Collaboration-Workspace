"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Message_1 = require("../models/Message");
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_2026';
// Track online users: Map<userId, Set<socketId>>
const onlineUsers = new Map();
const initializeSocket = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: 'http://localhost:5173',
            credentials: true,
        },
    });
    // Socket authentication middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new Error('Authentication required'));
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            socket.data.userId = decoded.id;
            next();
        }
        catch (err) {
            return next(new Error('Invalid or expired token'));
        }
    });
    io.on('connection', (socket) => {
        const userId = socket.data.userId;
        console.log(`[⚡ Socket Connected]: ${socket.id} (User: ${userId})`);
        // Track user online status
        if (!onlineUsers.has(userId)) {
            onlineUsers.set(userId, new Set());
        }
        onlineUsers.get(userId).add(socket.id);
        // Broadcast online status to all clients
        io.emit('user_online', { userId });
        // Send current online users list to the newly connected client
        const currentOnlineIds = Array.from(onlineUsers.keys());
        socket.emit('online_users_list', currentOnlineIds);
        // Join a specific channel room
        socket.on('join_channel', (channelId) => {
            socket.join(channelId);
            console.log(`[Socket ${socket.id}] joined room: ${channelId}`);
        });
        // Leave a channel room
        socket.on('leave_channel', (channelId) => {
            socket.leave(channelId);
        });
        // Handle incoming message broadcast & MongoDB persistence
        socket.on('send_message', async (data) => {
            try {
                const { channelId, workspaceId, content } = data;
                const newMessage = await Message_1.MessageModel.create({
                    sender: userId,
                    channel: channelId,
                    workspace: workspaceId,
                    content,
                });
                const populatedMessage = await newMessage.populate('sender', 'name email avatar');
                // Broadcast message to everyone currently in the channel room
                io.to(channelId).emit('receive_message', populatedMessage);
            }
            catch (error) {
                console.error('[Socket Message Error]:', error);
                socket.emit('message_error', { error: 'Failed to send message' });
            }
        });
        // Handle real-time typing indicators
        socket.on('typing', (data) => {
            socket.to(data.channelId).emit('user_typing', data);
        });
        socket.on('disconnect', () => {
            console.log(`[⚡ Socket Disconnected]: ${socket.id} (User: ${userId})`);
            // Remove socket from user's set
            const userSockets = onlineUsers.get(userId);
            if (userSockets) {
                userSockets.delete(socket.id);
                // If user has no more active sockets, they're offline
                if (userSockets.size === 0) {
                    onlineUsers.delete(userId);
                    io.emit('user_offline', { userId });
                }
            }
        });
    });
    return io;
};
exports.initializeSocket = initializeSocket;
