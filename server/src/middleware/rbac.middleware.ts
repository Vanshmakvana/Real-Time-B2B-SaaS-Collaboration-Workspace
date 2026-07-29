import { Response, NextFunction } from 'express';
import { WorkspaceModel } from '../models/Workspace';
import { AuthenticatedRequest } from './auth.middleware';
import { CustomResponse } from './response';

export interface WorkspaceRequest extends AuthenticatedRequest {
  workspace?: any;
  userRole?: 'admin' | 'member';
}

export const requireWorkspaceMembership = async (
  req: WorkspaceRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const customRes = res as CustomResponse;
  try {
    const workspaceId = req.params.workspaceId || req.body.workspaceId;
    const userId = req.user?.id;

    if (!workspaceId) {
      customRes.error('Workspace ID is required', 400);
      return;
    }

    const workspace = await WorkspaceModel.findById(workspaceId);
    if (!workspace) {
      customRes.error('Workspace not found', 404);
      return;
    }

    const memberRecord = workspace.members.find(
      (m) => m.user.toString() === userId
    );

    if (!memberRecord) {
      customRes.error('Access denied. You are not a member of this workspace.', 403);
      return;
    }

    req.workspace = workspace;
    req.userRole = memberRecord.role;
    next();
  } catch (error: any) {
    customRes.error(error.message || 'Error authorizing workspace access', 500);
  }
};
