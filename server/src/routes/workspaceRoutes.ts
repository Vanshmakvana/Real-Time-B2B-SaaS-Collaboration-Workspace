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
} from "../controllers/workspaceController";

const router = Router();

router.use(protect);

router
  .route("/")
  .post(createWorkspace)
  .get(getMyWorkspaces);

router.post("/join", joinWorkspace);

router.put("/:id/invite", regenerateInviteCode);

router
  .route("/:id")
  .get(getWorkspaceById)
  .put(updateWorkspace)
  .delete(deleteWorkspace);

export default router;
