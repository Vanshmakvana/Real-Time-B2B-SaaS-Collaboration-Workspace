import { Response } from "express";

import Message from "../models/Message";
import Channel from "../models/Channel";

import asyncHandler from "../utils/asyncHandler";
import { AuthRequest } from "../middleware/authMiddleware";

export const sendMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { content, workspaceId, channelId } = req.body;

  const channel = await Channel.findById(channelId);

  if (!channel) {
    res.status(404).json({
      success: false,
      message: "Channel not found",
    });

    return;
  }

  const message = await Message.create({
    content,
    sender: req.user?.id,
    workspace: workspaceId,
    channel: channelId,
  });

  await message.populate("sender", "name email avatar");

  res.status(201).json({
    success: true,
    message: "Message sent successfully",
    data: message,
  });
});

export const getChannelMessages = asyncHandler(async (req: AuthRequest, res: Response) => {
  const messages = await Message.find({
    channel: req.params.channelId,
  })
    .populate("sender", "name email avatar")
    .sort({ createdAt: 1 });

  res.json({
    success: true,
    count: messages.length,
    data: messages,
  });
});

export const updateMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { content } = req.body;

  const message = await Message.findById(req.params.id);

  if (!message) {
    res.status(404).json({
      success: false,
      message: "Message not found",
    });

    return;
  }

  if (message.sender.toString() !== req.user?.id) {
    res.status(403).json({
      success: false,
      message: "You can only edit your own messages",
    });

    return;
  }

  message.content = content;
  message.edited = true;

  await message.save();

  res.json({
    success: true,
    message: "Message updated successfully",
    data: message,
  });
});

export const deleteMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    res.status(404).json({
      success: false,
      message: "Message not found",
    });

    return;
  }

  if (message.sender.toString() !== req.user?.id) {
    res.status(403).json({
      success: false,
      message: "You can only delete your own messages",
    });

    return;
  }

  await message.deleteOne();

  res.json({
    success: true,
    message: "Message deleted successfully",
  });
});