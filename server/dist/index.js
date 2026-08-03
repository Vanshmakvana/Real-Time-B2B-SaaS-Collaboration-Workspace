"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const response_1 = require("./middleware/response");
const routes_1 = __importDefault(require("./routes"));
const db_1 = require("./config/db");
const socket_server_1 = require("./socket/socket.server");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Create HTTP server for Express and Socket.IO integration
const httpServer = http_1.default.createServer(app);
// Initialize Database Connection
(0, db_1.connectDatabase)();
// Initialize Socket.IO Server
(0, socket_server_1.initializeSocket)(httpServer);
// Security and Parsing Middleware
app.use((0, cors_1.default)({ origin: 'http://localhost:5173', credentials: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Custom JSON Formatter Middleware
app.use(response_1.responseFormatter);
// Bind Master API Router
app.use('/api/v1', routes_1.default);
// Start the server using the HTTP wrapper
httpServer.listen(PORT, () => {
    console.log(`[🚀 Server]: Running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
