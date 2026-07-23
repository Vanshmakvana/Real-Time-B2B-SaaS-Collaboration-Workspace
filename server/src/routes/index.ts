import { Router } from 'express';
import { CustomResponse } from '../middleware/response';
import authRoutes from './auth.routes';
import workspaceRoutes from './workspace.routes';
import channelRoutes from './channel.routes';

const router = Router();

// API Health Check Route
router.get('/health', (req, res) => {
  const customRes = res as CustomResponse;
  customRes.success({ status: 'UP', timestamp: new Date() }, 'Server is running smoothly');
});

// Bind Application Routes
router.use('/auth', authRoutes);
router.use('/workspaces', workspaceRoutes);
router.use('/workspaces/:workspaceId/channels', channelRoutes);

export default router;
