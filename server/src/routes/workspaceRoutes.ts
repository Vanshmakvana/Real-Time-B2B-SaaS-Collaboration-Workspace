import { Router } from "express";

import protect from "../middleware/authMiddleware";

import {
  createWorkspace,
  getMyWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  joinWorkspace,
  regenerateInviteCode,
  searchWorkspaces,
  notifyWorkspaceInvite,
} from "../controllers/workspaceController";

const router = Router();

router.use(protect);

router.route("/")
  .post(createWorkspace)
  .get(getMyWorkspaces);

router.get("/search", searchWorkspaces);

router.post("/join", joinWorkspace);

router.post("/invite-notify", notifyWorkspaceInvite);

router.put("/:id/invite", regenerateInviteCode);

router.route("/:id")
  .get(getWorkspaceById)
  .put(updateWorkspace)
  .delete(deleteWorkspace);

export default router;
