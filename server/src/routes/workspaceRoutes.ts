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
} from "../controllers/workspaceController";

const router = Router();

router.use(protect);

// Create a workspace & Get all workspaces
router
  .route("/")
  .post(createWorkspace)
  .get(getMyWorkspaces);

// Search workspaces
router.get("/search", searchWorkspaces);

// Join a workspace using an invite code
router.post("/join", joinWorkspace);

// Regenerate invite code
router.put("/:id/invite", regenerateInviteCode);

// Workspace CRUD operations
router
  .route("/:id")
  .get(getWorkspaceById)
  .put(updateWorkspace)
  .delete(deleteWorkspace);

export default router;
