import { Document, Types } from 'mongoose';

export interface IChannel extends Document {
  id: string;
  name: string;
  workspace: Types.ObjectId;
  isPrivate: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
