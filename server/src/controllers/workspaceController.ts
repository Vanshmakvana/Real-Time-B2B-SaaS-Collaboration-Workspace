import { Response } from "express";
import crypto from "crypto";

import Workspace from "../models/Workspace";
import User from "../models/User";

import asyncHandler from "../utils/asyncHandler";
import { AuthRequest } from "../middleware/authMiddleware";

export const createWorkspace = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name, description } = req.body;

    const inviteCode = crypto.randomBytes(5).toString("hex");

    const workspace = await Workspace.create({
      name,
      description,
      owner: req.user?.id,
      members: [req.user?.id],
      inviteCode,
    });

    await User.findByIdAndUpdate(req.user?.id, {
      $push: {
        workspaces: workspace._id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Workspace created successfully",
      data: workspace,
    });
  }
);

export const getMyWorkspaces = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const workspaces = await Workspace.find({
      members: req.user?.id,
    })
      .populate("owner", "name email")
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      count: workspaces.length,
      data: workspaces,
    });
  }
);