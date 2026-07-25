import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

interface JwtPayload {
  id: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    req.user = decoded;

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

export default protect;
