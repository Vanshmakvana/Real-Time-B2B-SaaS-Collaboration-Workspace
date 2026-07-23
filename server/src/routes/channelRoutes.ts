import { Router } from "express";

import protect from "../middleware/authMiddleware";

import {
  createChannel,
  getWorkspaceChannels,
  updateChannel,
  deleteChannel,
} from "../controllers/channelController";

const router = Router();

router.use(protect);

router.route("/")
  .post(createChannel);

router.get(
  "/workspace/:workspaceId",
  getWorkspaceChannels
);

router.route("/:id")
  .put(updateChannel)
  .delete(deleteChannel);

export default router;