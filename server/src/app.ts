import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import errorHandler from "./middleware/errorMiddleware";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "API Running",
  });
});

app.use("/api/auth", authRoutes);

app.use(errorHandler);

export default app;