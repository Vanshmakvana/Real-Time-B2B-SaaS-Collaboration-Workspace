import mongoose, { Document, Schema, Types } from "mongoose";

export interface IMessage extends Document {
  content: string;
  sender: Types.ObjectId;
  workspace: Types.ObjectId;
  channel: Types.ObjectId;
  edited: boolean;
}

const MessageSchema = new Schema<IMessage>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },

    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },

    channel: {
      type: Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },

    edited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMessage>(
  "Message",
  MessageSchema
);