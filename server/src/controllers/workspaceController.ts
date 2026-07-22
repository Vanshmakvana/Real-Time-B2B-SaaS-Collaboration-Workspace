import { Response } from "express";
import crypto from "crypto";

import Workspace from "../models/Workspace";
import User from "../models/User";

import asyncHandler from "../utils/asyncHandler";
import { AuthRequest } from "../middleware/authMiddleware";

export const createWorkspace = asyncHandler(async (req: AuthRequest, res: Response) => {
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
});

export const getMyWorkspaces = asyncHandler(async (req: AuthRequest, res: Response) => {
  const workspaces = await Workspace.find({
    members: req.user?.id,
  })
    .populate("owner", "name email")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: workspaces.length,
    data: workspaces,
  });
});

export const getWorkspaceById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const workspace = await Workspace.findById(req.params.id)
    .populate("owner", "name email")
    .populate("members", "name email avatar");

  if (!workspace) {
    res.status(404).json({
      success: false,
      message: "Workspace not found",
    });
    return;
  }

  res.json({
    success: true,
    data: workspace,
  });
});

export const updateWorkspace = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, description } = req.body;

  const workspace = await Workspace.findById(req.params.id);

  if (!workspace) {
    res.status(404).json({
      success: false,
      message: "Workspace not found",
    });

    return;
  }

  if (workspace.owner.toString() !== req.user?.id) {
    res.status(403).json({
      success: false,
      message: "Only the workspace owner can update this workspace",
    });

    return;
  }

  workspace.name = name || workspace.name;
  workspace.description = description || workspace.description;

  await workspace.save();

  res.json({
    success: true,
    message: "Workspace updated successfully",
    data: workspace,
  });
});

export const deleteWorkspace = asyncHandler(async (req: AuthRequest, res: Response) => {
  const workspace = await Workspace.findById(req.params.id);

  if (!workspace) {
    res.status(404).json({
      success: false,
      message: "Workspace not found",
    });

    return;
  }

  if (workspace.owner.toString() !== req.user?.id) {
    res.status(403).json({
      success: false,
      message: "Only the workspace owner can delete this workspace",
    });

    return;
  }

  await workspace.deleteOne();

  await User.updateMany(
    {},
    {
      $pull: {
        workspaces: workspace._id,
      },
    }
  );

  res.json({
    success: true,
    message: "Workspace deleted successfully",
  });
});
