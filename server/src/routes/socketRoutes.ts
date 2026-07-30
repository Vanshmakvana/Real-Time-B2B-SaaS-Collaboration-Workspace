import { Router } from "express";
import protect from "../middleware/authMiddleware";
import { getOnlineUsersController } from "../controllers/socketController";

const router = Router();

router.use(protect);

router.get("/online-users", getOnlineUsersController);

export default router;