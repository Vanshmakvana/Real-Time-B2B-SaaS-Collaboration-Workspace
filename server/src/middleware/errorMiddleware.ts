import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import logger from "../utils/logger";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  logger.error({
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    statusCode,
    message: err.message,
    stack: err.stack,
  });

  res.status(statusCode).json({
    success: false,
    requestId: req.requestId,
    message: err.message || "Internal Server Error",
    ...(env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

export default errorHandler;
