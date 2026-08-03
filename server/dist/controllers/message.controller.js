"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChannelMessages = void 0;
const Message_1 = require("../models/Message");
// Get message history for a specific channel
const getChannelMessages = async (req, res) => {
    const customRes = res;
    try {
        const { channelId } = req.params;
        const limit = parseInt(req.query.limit) || 50;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        if (!channelId) {
            customRes.error('Channel ID is required', 400);
            return;
        }
        // Retrieve messages sorted from newest to oldest for pagination, then populated
        const messages = await Message_1.MessageModel.find({ channel: channelId })
            .populate('sender', 'name email avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        // Return in chronological order (oldest first) so chat renders naturally from top to bottom
        const chronologicalMessages = messages.reverse();
        const totalMessages = await Message_1.MessageModel.countDocuments({ channel: channelId });
        customRes.success({
            messages: chronologicalMessages,
            pagination: {
                totalMessages,
                currentPage: page,
                totalPages: Math.ceil(totalMessages / limit),
            },
        }, 'Channel messages retrieved successfully');
    }
    catch (error) {
        customRes.error(error.message || 'Error fetching channel messages', 500);
    }
};
exports.getChannelMessages = getChannelMessages;
