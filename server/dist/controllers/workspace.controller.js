"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinWorkspaceByInvite = exports.getUserWorkspaces = exports.createWorkspace = void 0;
const Workspace_1 = require("../models/Workspace");
const Channel_1 = require("../models/Channel");
// Create a new Workspace
const createWorkspace = async (req, res) => {
    const customRes = res;
    try {
        const { name } = req.body;
        const userId = req.user?.id;
        if (!name) {
            customRes.error('Workspace name is required', 400);
            return;
        }
        const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
        // Create workspace with creator as owner and admin member
        const workspace = await Workspace_1.WorkspaceModel.create({
            name,
            slug,
            owner: userId,
            members: [{ user: userId, role: 'admin' }],
        });
        // Automatically create a default #general channel for the workspace
        await Channel_1.ChannelModel.create({
            name: 'general',
            workspace: workspace.id,
            createdBy: userId,
        });
        customRes.success(workspace, 'Workspace created successfully', 201);
    }
    catch (error) {
        customRes.error(error.message || 'Error creating workspace', 500);
    }
};
exports.createWorkspace = createWorkspace;
// Get all workspaces the authenticated user belongs to
const getUserWorkspaces = async (req, res) => {
    const customRes = res;
    try {
        const userId = req.user?.id;
        const workspaces = await Workspace_1.WorkspaceModel.find({
            'members.user': userId,
        }).populate('members.user', 'name email avatar');
        customRes.success(workspaces, 'Workspaces retrieved successfully');
    }
    catch (error) {
        customRes.error(error.message || 'Error fetching workspaces', 500);
    }
};
exports.getUserWorkspaces = getUserWorkspaces;
// Join a workspace using an invite code
const joinWorkspaceByInvite = async (req, res) => {
    const customRes = res;
    try {
        const { inviteCode } = req.body;
        const userId = req.user?.id;
        if (!inviteCode) {
            customRes.error('Invite code is required', 400);
            return;
        }
        const workspace = await Workspace_1.WorkspaceModel.findOne({ inviteCode });
        if (!workspace) {
            customRes.error('Invalid invite code', 404);
            return;
        }
        // Check if user is already a member
        const isMember = workspace.members.some((m) => m.user.toString() === userId);
        if (isMember) {
            customRes.error('You are already a member of this workspace', 400);
            return;
        }
        // Add user as regular member
        workspace.members.push({ user: userId, role: 'member' });
        await workspace.save();
        customRes.success(workspace, 'Successfully joined workspace');
    }
    catch (error) {
        customRes.error(error.message || 'Error joining workspace', 500);
    }
};
exports.joinWorkspaceByInvite = joinWorkspaceByInvite;
