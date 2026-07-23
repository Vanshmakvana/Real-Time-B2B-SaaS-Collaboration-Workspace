import { Response } from 'express';
import { WorkspaceModel } from '../models/Workspace';
import { ChannelModel } from '../models/Channel';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { CustomResponse } from '../middleware/response';

// Create a new Workspace
export const createWorkspace = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const customRes = res as CustomResponse;
  try {
    const { name } = req.body;
    const userId = req.user?.id;

    if (!name) {
      customRes.error('Workspace name is required', 400);
      return;
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();

    // Create workspace with creator as owner and admin member
    const workspace = await WorkspaceModel.create({
      name,
      slug,
      owner: userId,
      members: [{ user: userId, role: 'admin' }],
    });

    // Automatically create a default #general channel for the workspace
    await ChannelModel.create({
      name: 'general',
      workspace: workspace.id,
      createdBy: userId,
    });

    customRes.success(workspace, 'Workspace created successfully', 201);
  } catch (error: any) {
    customRes.error(error.message || 'Error creating workspace', 500);
  }
};

// Get all workspaces the authenticated user belongs to
export const getUserWorkspaces = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const customRes = res as CustomResponse;
  try {
    const userId = req.user?.id;

    const workspaces = await WorkspaceModel.find({
      'members.user': userId,
    }).populate('members.user', 'name email avatar');

    customRes.success(workspaces, 'Workspaces retrieved successfully');
  } catch (error: any) {
    customRes.error(error.message || 'Error fetching workspaces', 500);
  }
};

// Join a workspace using an invite code
export const joinWorkspaceByInvite = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const customRes = res as CustomResponse;
  try {
    const { inviteCode } = req.body;
    const userId = req.user?.id;

    if (!inviteCode) {
      customRes.error('Invite code is required', 400);
      return;
    }

    const workspace = await WorkspaceModel.findOne({ inviteCode });
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
    workspace.members.push({ user: userId as any, role: 'member' });
    await workspace.save();

    customRes.success(workspace, 'Successfully joined workspace');
  } catch (error: any) {
    customRes.error(error.message || 'Error joining workspace', 500);
  }
};
