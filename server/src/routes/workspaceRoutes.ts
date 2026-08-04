import { Router } from "express";

import protect from "../middleware/authMiddleware";
import validateRequest from "../middleware/validateRequest";

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

import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  joinWorkspaceSchema,
} from "../validators/workspaceSchemas";

const router = Router();

router.use(protect);

router
  .route("/")
  .post(validateRequest(createWorkspaceSchema), createWorkspace)
  .get(getMyWorkspaces);

router.get("/search", searchWorkspaces);

router.post("/join", validateRequest(joinWorkspaceSchema), joinWorkspace);

router.post("/invite-notify", notifyWorkspaceInvite);

router.put("/:id/invite", regenerateInviteCode);

router
  .route("/:id")
  .get(getWorkspaceById)
  .put(validateRequest(updateWorkspaceSchema), updateWorkspace)
  .delete(deleteWorkspace);

export default router;
