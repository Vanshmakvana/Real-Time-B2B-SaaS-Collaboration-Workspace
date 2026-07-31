import { Schema, model } from 'mongoose';
import { IChannel } from '../types/channel.interface';

const channelSchema = new Schema<IChannel>(
  {
    name: {
      type: String,
      required: [true, 'Channel name is required'],
      trim: true,
      lowercase: true,
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound index to ensure channel names are unique per workspace
channelSchema.index({ name: 1, workspace: 1 }, { unique: true });

export const ChannelModel = model<IChannel>('Channel', channelSchema);
