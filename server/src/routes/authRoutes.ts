import { Router } from "express";

import {
  register,
  login,
  getProfile,
} from "../controllers/authController";

import protect from "../middleware/authMiddleware";
import validateRequest from "../middleware/validateRequest";

import {
  registerSchema,
  loginSchema,
} from "../validators/authSchemas";

const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  register
);

router.post(
  "/login",
  validateRequest(loginSchema),
  login
);

router.get("/me", protect, getProfile);

export default router;
