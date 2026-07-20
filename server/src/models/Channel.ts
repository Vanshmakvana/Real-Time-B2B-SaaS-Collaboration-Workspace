import mongoose, { Document, Schema, Types } from "mongoose";

export interface IChannel extends Document {
  name: string;
  workspace: Types.ObjectId;
  createdBy: Types.ObjectId;
  type: "public" | "private";
}

const ChannelSchema = new Schema<IChannel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IChannel>(
  "Channel",
  ChannelSchema
);