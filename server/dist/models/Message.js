"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = void 0;
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    channel: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Channel',
        required: true,
        index: true,
    },
    workspace: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true,
    },
    content: {
        type: String,
        required: [true, 'Message content cannot be empty'],
        trim: true,
    },
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
exports.MessageModel = (0, mongoose_1.model)('Message', messageSchema);
