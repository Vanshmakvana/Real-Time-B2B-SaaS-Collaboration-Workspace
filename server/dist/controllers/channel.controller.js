"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkspaceChannels = exports.createChannel = void 0;
const Channel_1 = require("../models/Channel");
// Create a new channel inside a workspace
const createChannel = async (req, res) => {
    const customRes = res;
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
        const existingChannel = await Channel_1.ChannelModel.findOne({
            name: formattedName,
            workspace: workspaceId,
        });
        if (existingChannel) {
            customRes.error('A channel with this name already exists in this workspace', 400);
            return;
        }
        const channel = await Channel_1.ChannelModel.create({
            name: formattedName,
            workspace: workspaceId,
            isPrivate: Boolean(isPrivate),
            createdBy: userId,
        });
        customRes.success(channel, 'Channel created successfully', 201);
    }
    catch (error) {
        customRes.error(error.message || 'Error creating channel', 500);
    }
};
exports.createChannel = createChannel;
// Get all channels for a specific workspace
const getWorkspaceChannels = async (req, res) => {
    const customRes = res;
    try {
        const workspaceId = req.params.workspaceId;
        const channels = await Channel_1.ChannelModel.find({ workspace: workspaceId }).sort({ createdAt: 1 });
        customRes.success(channels, 'Workspace channels retrieved successfully');
    }
    catch (error) {
        customRes.error(error.message || 'Error fetching channels', 500);
    }
};
exports.getWorkspaceChannels = getWorkspaceChannels;
