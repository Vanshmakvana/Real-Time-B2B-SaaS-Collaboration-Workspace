"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const channel_controller_1 = require("../controllers/channel.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const router = (0, express_1.Router)({ mergeParams: true });
// Protect all channel routes with JWT & RBAC membership middleware
router.use(auth_middleware_1.authenticateToken);
router.post('/', rbac_middleware_1.requireWorkspaceMembership, channel_controller_1.createChannel);
router.get('/', rbac_middleware_1.requireWorkspaceMembership, channel_controller_1.getWorkspaceChannels);
exports.default = router;
