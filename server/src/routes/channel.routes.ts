import { Router } from 'express';
import { createChannel, getWorkspaceChannels } from '../controllers/channel.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireWorkspaceMembership } from '../middleware/rbac.middleware';

const router = Router({ mergeParams: true });

// Protect all channel routes with JWT & RBAC membership middleware
router.use(authenticateToken);

router.post('/', requireWorkspaceMembership, createChannel);
router.get('/', requireWorkspaceMembership, getWorkspaceChannels);

export default router;
