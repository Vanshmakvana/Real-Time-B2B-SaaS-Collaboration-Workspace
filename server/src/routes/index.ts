import { Router } from 'express';
import { CustomResponse } from '../middleware/response';

const router = Router();

// API Health Check Route
router.get('/health', (req, res) => {
  const customRes = res as CustomResponse;
  customRes.success({ status: 'UP', timestamp: new Date() }, 'Server is running smoothly');
});

export default router;
