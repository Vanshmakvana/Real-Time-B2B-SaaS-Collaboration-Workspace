"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const workspace_controller_1 = require("../controllers/workspace.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Protect all workspace routes with JWT authentication
router.use(auth_middleware_1.authenticateToken);
router.post('/', workspace_controller_1.createWorkspace);
router.get('/', workspace_controller_1.getUserWorkspaces);
router.post('/join', workspace_controller_1.joinWorkspaceByInvite);
exports.default = router;
