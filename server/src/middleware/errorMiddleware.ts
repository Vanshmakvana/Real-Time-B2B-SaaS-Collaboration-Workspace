import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

export default errorHandler;
