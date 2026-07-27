import http from "http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";

import { env } from "../config/env";

interface JwtPayload {
  id: string;
  role: string;
}

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
      const decoded = jwt.verify(
        token,
        env.JWT_SECRET
      ) as JwtPayload;

      socket.data.user = decoded;

      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(
      `✅ ${socket.data.user.id} connected (${socket.id})`
    );

    socket.on("disconnect", () => {
      console.log(
        `❌ ${socket.data.user.id} disconnected`
      );
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