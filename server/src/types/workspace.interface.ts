import { Document, Types } from 'mongoose';

export interface IWorkspace extends Document {
  id: string;
  name: string;
  slug: string;
  owner: Types.ObjectId;
  members: Array<{
    user: Types.ObjectId;
    role: 'admin' | 'member';
  }>;
  inviteCode: string;
  createdAt: Date;
  updatedAt: Date;
}
