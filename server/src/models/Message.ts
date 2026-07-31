import { Schema, model } from 'mongoose';
import { IMessage } from '../types/message.interface';

const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    channel: {
      type: Schema.Types.ObjectId,
      ref: 'Channel',
      required: true,
      index: true,
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Message content cannot be empty'],
      trim: true,
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

export const MessageModel = model<IMessage>('Message', messageSchema);
