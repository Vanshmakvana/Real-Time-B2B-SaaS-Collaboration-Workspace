import http from "http";

import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import { initializeSocket } from "./socket/socket";

const startServer = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);

    initializeSocket(server);

    server.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();
