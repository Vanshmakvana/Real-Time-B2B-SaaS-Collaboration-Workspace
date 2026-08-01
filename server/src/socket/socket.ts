import http from "http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";

import { env } from "../config/env";
import { emitSocketError } from "./errorHandler";
import { validateMessagePayload } from "./validators";

interface JwtPayload {
  id: string;
  role: string;
}

const onlineUsers = new Map<string, string>();
const messageCounter = new Map<string, { count: number; timestamp: number }>();

let io: Server;

const canSendMessage = (userId: string): boolean => {
  const now = Date.now();
  const current = messageCounter.get(userId);

  if (!current || now - current.timestamp > 10000) {
    messageCounter.set(userId, { count: 1, timestamp: now });
    return true;
  }

  if (current.count >= 20) {
    return false;
  }

  current.count += 1;
  return true;
};

export const initializeSocket = (server: http.Server): Server => {
  io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
    transports: ["websocket", "polling"],
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) return next(new Error("Authentication failed"));

    try {
      socket.data.user = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.user.id;

    onlineUsers.set(userId, socket.id);
    socket.join(`user:${userId}`);

    socket.on("send-message", (message) => {
      if (!validateMessagePayload(message)) {
        emitSocketError(socket, "send-message", "Invalid message payload");
        return;
      }

      if (!canSendMessage(userId)) {
        emitSocketError(socket, "send-message", "Rate limit exceeded");
        return;
      }

      io.to(`channel:${message.channelId}`).emit("receive-message", {
        ...message,
        senderId: userId,
        createdAt: new Date(),
      });
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      messageCounter.delete(userId);
    });
  });

  return io;
};

export const getIO = () => io;
export const getOnlineUsers = () => onlineUsers;
