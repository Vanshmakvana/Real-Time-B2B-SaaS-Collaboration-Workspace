import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes";
import workspaceRoutes from "./routes/workspaceRoutes";
import channelRoutes from "./routes/channelRoutes";
import messageRoutes from "./routes/messageRoutes";
import socketRoutes from "./routes/socketRoutes";

import notFound from "./middleware/notFound";
import errorHandler from "./middleware/errorMiddleware";

const app = express();

app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
      success: false,
      message: "Too many requests. Please try again later.",
    },
  })
);

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "API Running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/socket", socketRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
