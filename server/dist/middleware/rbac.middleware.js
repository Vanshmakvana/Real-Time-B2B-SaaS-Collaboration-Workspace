"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireWorkspaceMembership = void 0;
const Workspace_1 = require("../models/Workspace");
const requireWorkspaceMembership = async (req, res, next) => {
    const customRes = res;
    try {
        const workspaceId = req.params.workspaceId || req.body.workspaceId;
        const userId = req.user?.id;
        if (!workspaceId) {
            customRes.error('Workspace ID is required', 400);
            return;
        }
        const workspace = await Workspace_1.WorkspaceModel.findById(workspaceId);
        if (!workspace) {
            customRes.error('Workspace not found', 404);
            return;
        }
        const memberRecord = workspace.members.find((m) => m.user.toString() === userId);
        if (!memberRecord) {
            customRes.error('Access denied. You are not a member of this workspace.', 403);
            return;
        }
        req.workspace = workspace;
        req.userRole = memberRecord.role;
        next();
    }
    catch (error) {
        customRes.error(error.message || 'Error authorizing workspace access', 500);
    }
};
exports.requireWorkspaceMembership = requireWorkspaceMembership;
