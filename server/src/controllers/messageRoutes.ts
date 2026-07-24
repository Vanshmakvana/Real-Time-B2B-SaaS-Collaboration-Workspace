import { Router } from "express";

import protect from "../middleware/authMiddleware";

import {
  sendMessage,
  getChannelMessages,
  updateMessage,
  deleteMessage,
} from "../controllers/messageController";

const router = Router();

router.use(protect);

router.route("/")
  .post(sendMessage);

router.get(
  "/channel/:channelId",
  getChannelMessages
);

router.route("/:id")
  .put(updateMessage)
  .delete(deleteMessage);

export default router;