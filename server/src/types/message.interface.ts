import { Document, Types } from 'mongoose';

export interface IMessage extends Document {
  id: string;
  sender: Types.ObjectId;
  channel: Types.ObjectId;
  workspace: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
