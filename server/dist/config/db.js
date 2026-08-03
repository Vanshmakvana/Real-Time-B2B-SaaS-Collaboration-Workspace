"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in the environment variables.');
        }
        const connection = await mongoose_1.default.connect(mongoUri);
        console.log(`[💾 MongoDB]: Successfully connected to host: ${connection.connection.host}`);
    }
    catch (error) {
        console.error('[❌ MongoDB Connection Error]:', error);
        process.exit(1); // Exit process with failure code if connection fails
    }
};
exports.connectDatabase = connectDatabase;
