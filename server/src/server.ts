import http from "http";

import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import { initializeSocket } from "./socket";

const startServer = async () => {
  try {
    console.log("🔧 Starting B2B Collaboration API...");
    console.log(`🌍 Environment: ${env.NODE_ENV}`);
    console.log(`🔌 Port: ${env.PORT}`);

    await connectDB();
    console.log("✅ MongoDB connected");

    const server = http.createServer(app);

    initializeSocket(server);
    console.log("⚡ Socket.IO initialized");

    server.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT}`);
      console.log(`📡 API: http://localhost:${env.PORT}/api/v1`);
      console.log(`❤️ Health: http://localhost:${env.PORT}/health`);
    });

    process.on("SIGTERM", () => {
      console.log("🛑 SIGTERM received. Shutting down gracefully...");
      server.close(() => {
        console.log("✅ HTTP server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("❌ Failed to start server:");
    console.error(error);
    process.exit(1);
  }
};

startServer();
