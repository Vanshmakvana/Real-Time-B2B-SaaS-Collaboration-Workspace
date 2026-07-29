import { Router } from 'express';
import { getChannelMessages } from '../controllers/message.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireWorkspaceMembership } from '../middleware/rbac.middleware';

const router = Router({ mergeParams: true });

// Protect message routes with JWT & Workspace membership verification
router.use(authenticateToken);

router.get('/:channelId/messages', requireWorkspaceMembership, getChannelMessages);

export default router;
