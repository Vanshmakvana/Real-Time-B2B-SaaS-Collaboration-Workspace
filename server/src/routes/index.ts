import { Router } from 'express';
import { CustomResponse } from '../middleware/response';
import authRoutes from './auth.routes';

const router = Router();

// API Health Check Route
router.get('/health', (req, res) => {
  const customRes = res as CustomResponse;
  customRes.success({ status: 'UP', timestamp: new Date() }, 'Server is running smoothly');
});

// Bind Auth Routes
router.use('/auth', authRoutes);

export default router;
