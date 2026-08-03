"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const workspace_routes_1 = __importDefault(require("./workspace.routes"));
const channel_routes_1 = __importDefault(require("./channel.routes"));
const message_routes_1 = __importDefault(require("./message.routes"));
const router = (0, express_1.Router)();
// API Health Check Route
router.get('/health', (req, res) => {
    const customRes = res;
    customRes.success({ status: 'UP', timestamp: new Date() }, 'Server is running smoothly');
});
// Bind Application Routes
router.use('/auth', auth_routes_1.default);
router.use('/workspaces', workspace_routes_1.default);
router.use('/workspaces/:workspaceId/channels', channel_routes_1.default);
router.use('/workspaces/:workspaceId/channels', message_routes_1.default);
exports.default = router;
