import { Schema, model } from 'mongoose';
import { IUser } from '../types/user.interface';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    // Automatically sanitize JSON representations before sending them over the wire
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.password; // Strips password from responses cleanly
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const UserModel = model<IUser>('User', userSchema);
