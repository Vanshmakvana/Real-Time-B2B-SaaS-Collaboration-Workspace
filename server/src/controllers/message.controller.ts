import { Response } from 'express';
import { MessageModel } from '../models/Message';
import { WorkspaceRequest } from '../middleware/rbac.middleware';
import { CustomResponse } from '../middleware/response';

// Get message history for a specific channel
export const getChannelMessages = async (req: WorkspaceRequest, res: Response): Promise<void> => {
  const customRes = res as CustomResponse;
  try {
    const { channelId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    if (!channelId) {
      customRes.error('Channel ID is required', 400);
      return;
    }

    // Retrieve messages sorted from newest to oldest for pagination, then populated
    const messages = await MessageModel.find({ channel: channelId })
      .populate('sender', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Return in chronological order (oldest first) so chat renders naturally from top to bottom
    const chronologicalMessages = messages.reverse();

    const totalMessages = await MessageModel.countDocuments({ channel: channelId });

    customRes.success(
      {
        messages: chronologicalMessages,
        pagination: {
          totalMessages,
          currentPage: page,
          totalPages: Math.ceil(totalMessages / limit),
        },
      },
      'Channel messages retrieved successfully'
    );
  } catch (error: any) {
    customRes.error(error.message || 'Error fetching channel messages', 500);
  }
};
