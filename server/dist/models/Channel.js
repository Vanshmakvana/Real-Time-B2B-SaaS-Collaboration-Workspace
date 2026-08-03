"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelModel = void 0;
const mongoose_1 = require("mongoose");
const channelSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Channel name is required'],
        trim: true,
        lowercase: true,
    },
    workspace: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true,
    },
    isPrivate: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
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
// Compound index to ensure channel names are unique per workspace
channelSchema.index({ name: 1, workspace: 1 }, { unique: true });
exports.ChannelModel = (0, mongoose_1.model)('Channel', channelSchema);
