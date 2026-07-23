import { Response } from "express";

import Channel from "../models/Channel";
import Workspace from "../models/Workspace";

import asyncHandler from "../utils/asyncHandler";
import { AuthRequest } from "../middleware/authMiddleware";

export const createChannel = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, workspaceId, type } = req.body;

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    res.status(404).json({
      success: false,
      message: "Workspace not found",
    });

    return;
  }

  const channel = await Channel.create({
    name,
    workspace: workspaceId,
    createdBy: req.user?.id,
    type,
  });

  res.status(201).json({
    success: true,
    message: "Channel created successfully",
    data: channel,
  });
});

export const getWorkspaceChannels = asyncHandler(async (req: AuthRequest, res: Response) => {
  const channels = await Channel.find({
    workspace: req.params.workspaceId,
  })
    .populate("createdBy", "name email")
    .sort({ createdAt: 1 });

  res.json({
    success: true,
    count: channels.length,
    data: channels,
  });
});

export const updateChannel = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, type } = req.body;

  const channel = await Channel.findById(req.params.id);

  if (!channel) {
    res.status(404).json({
      success: false,
      message: "Channel not found",
    });

    return;
  }

  channel.name = name || channel.name;
  channel.type = type || channel.type;

  await channel.save();

  res.json({
    success: true,
    message: "Channel updated successfully",
    data: channel,
  });
});

export const deleteChannel = asyncHandler(async (req: AuthRequest, res: Response) => {
  const channel = await Channel.findById(req.params.id);

  if (!channel) {
    res.status(404).json({
      success: false,
      message: "Channel not found",
    });

    return;
  }

  await channel.deleteOne();

  res.json({
    success: true,
    message: "Channel deleted successfully",
  });
});