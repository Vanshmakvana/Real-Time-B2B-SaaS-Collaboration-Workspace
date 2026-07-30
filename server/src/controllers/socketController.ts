import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { getOnlineUsers } from "../socket/socket";

export const getOnlineUsersController = asyncHandler(
  async (_req: Request, res: Response) => {
    const users = Array.from(getOnlineUsers().keys());

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  }
);