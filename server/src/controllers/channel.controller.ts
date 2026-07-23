import { Response } from 'express';
import { ChannelModel } from '../models/Channel';
import { WorkspaceRequest } from '../middleware/rbac.middleware';
import { CustomResponse } from '../middleware/response';

// Create a new channel inside a workspace
export const createChannel = async (req: WorkspaceRequest, res: Response): Promise<void> => {
  const customRes = res as CustomResponse;
  try {
    const { name, isPrivate } = req.body;
    const workspaceId = req.params.workspaceId || req.body.workspaceId;
    const userId = req.user?.id;

    if (!name) {
      customRes.error('Channel name is required', 400);
      return;
    }

    const formattedName = name.toLowerCase().trim().replace(/\s+/g, '-');

    // Check for duplicate channel name within the same workspace
    const existingChannel = await ChannelModel.findOne({
      name: formattedName,
      workspace: workspaceId,
    });

    if (existingChannel) {
      customRes.error('A channel with this name already exists in this workspace', 400);
      return;
    }

    const channel = await ChannelModel.create({
      name: formattedName,
      workspace: workspaceId,
      isPrivate: Boolean(isPrivate),
      createdBy: userId,
    });

    customRes.success(channel, 'Channel created successfully', 201);
  } catch (error: any) {
    customRes.error(error.message || 'Error creating channel', 500);
  }
};

// Get all channels for a specific workspace
export const getWorkspaceChannels = async (req: WorkspaceRequest, res: Response): Promise<void> => {
  const customRes = res as CustomResponse;
  try {
    const workspaceId = req.params.workspaceId;

    const channels = await ChannelModel.find({ workspace: workspaceId }).sort({ createdAt: 1 });

    customRes.success(channels, 'Workspace channels retrieved successfully');
  } catch (error: any) {
    customRes.error(error.message || 'Error fetching channels', 500);
  }
};
