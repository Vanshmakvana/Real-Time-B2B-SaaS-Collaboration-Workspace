import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

const authorize =
  (...roles: string[]) =>
  (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });

      return;
    }

    if (!roles.includes((req.user as any).role)) {
      res.status(403).json({
        success: false,
        message: "Access denied",
      });

      return;
    }

    next();
  };

export default authorize;