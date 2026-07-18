import { Router } from "express";

import {
  register,
  login,
  getProfile,
} from "../controllers/authController";

import protect from "../middleware/authMiddleware";
import validateRequest from "../middleware/validateRequest";

import {
  registerValidator,
  loginValidator,
} from "../validators/authValidator";

const router = Router();

router.post(
  "/register",
  registerValidator,
  validateRequest,
  register
);

router.post(
  "/login",
  loginValidator,
  validateRequest,
  login
);

router.get("/me", protect, getProfile);

export default router;
