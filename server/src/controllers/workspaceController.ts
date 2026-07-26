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

export const getMyWorkspaces = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const total = await Workspace.countDocuments({
      members: req.user?.id,
    });

    const workspaces = await Workspace.find({
      members: req.user?.id,
    })
      .populate("owner", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      data: workspaces,
    });
  }
);

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

export const joinWorkspace = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { inviteCode } = req.body;

  const workspace = await Workspace.findOne({ inviteCode });

  if (!workspace) {
    res.status(404).json({
      success: false,
      message: "Invalid invite code",
    });

    return;
  }

  if (workspace.members.includes(req.user?.id as any)) {
    res.status(400).json({
      success: false,
      message: "You are already a member of this workspace",
    });

    return;
  }

  workspace.members.push(req.user?.id as any);

  await workspace.save();

  await User.findByIdAndUpdate(req.user?.id, {
    $push: {
      workspaces: workspace._id,
    },
  });

  res.json({
    success: true,
    message: "Successfully joined workspace",
    data: workspace,
  });
});

export const regenerateInviteCode = asyncHandler(async (req: AuthRequest, res: Response) => {
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
      message: "Only the workspace owner can regenerate the invite code",
    });

    return;
  }

  workspace.inviteCode = require("crypto")
    .randomBytes(5)
    .toString("hex");

  await workspace.save();

  res.json({
    success: true,
    message: "Invite code regenerated successfully",
    inviteCode: workspace.inviteCode,
  });
});

export const searchWorkspaces = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const keyword = req.query.keyword || "";

    const workspaces = await Workspace.find({
      members: req.user?.id,
      name: {
        $regex: keyword,
        $options: "i",
      },
    });

    res.json({
      success: true,
      count: workspaces.length,
      data: workspaces,
    });
  }
);
