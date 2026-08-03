"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const message_controller_1 = require("../controllers/message.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const router = (0, express_1.Router)({ mergeParams: true });
// Protect message routes with JWT & Workspace membership verification
router.use(auth_middleware_1.authenticateToken);
router.get('/:channelId/messages', rbac_middleware_1.requireWorkspaceMembership, message_controller_1.getChannelMessages);
exports.default = router;
