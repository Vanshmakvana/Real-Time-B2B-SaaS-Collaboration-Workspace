import http from "http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";

import { env } from "../config/env";

interface JwtPayload {
  id: string;
  role: string;
}

const onlineUsers = new Map<string, string>();

let io: Server;

export const initializeSocket = (server: http.Server): Server => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication failed"));
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      socket.data.user = decoded;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.user.id;

    onlineUsers.set(userId, socket.id);

    io.emit("user-online", { userId });

    console.log(`✅ ${userId} connected (${socket.id})`);

    socket.on("join-workspace", (workspaceId: string) => {
      socket.join(`workspace:${workspaceId}`);
      socket.emit("workspace-joined", { workspaceId });
    });

    socket.on("leave-workspace", (workspaceId: string) => {
      socket.leave(`workspace:${workspaceId}`);
      socket.emit("workspace-left", { workspaceId });
    });

    socket.on("join-channel", (channelId: string) => {
      socket.join(`channel:${channelId}`);
      socket.emit("channel-joined", { channelId });
    });

    socket.on("leave-channel", (channelId: string) => {
      socket.leave(`channel:${channelId}`);
      socket.emit("channel-left", { channelId });
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);

      io.emit("user-offline", { userId });

      console.log(`❌ ${userId} disconnected`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized.");
  }

  return io;
};

export const getOnlineUsers = () => onlineUsers;
