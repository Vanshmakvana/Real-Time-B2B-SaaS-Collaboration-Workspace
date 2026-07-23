import { Router } from 'express';
import {
  createWorkspace,
  getUserWorkspaces,
  joinWorkspaceByInvite,
} from '../controllers/workspace.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Protect all workspace routes with JWT authentication
router.use(authenticateToken);

router.post('/', createWorkspace);
router.get('/', getUserWorkspaces);
router.post('/join', joinWorkspaceByInvite);

export default router;
