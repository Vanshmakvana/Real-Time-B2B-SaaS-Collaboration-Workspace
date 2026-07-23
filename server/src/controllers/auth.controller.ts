import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { hashPassword, comparePasswords, generateToken } from '../utils/auth';
import { CustomResponse } from '../middleware/response';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const customRes = res as CustomResponse;
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      customRes.error('Please provide name, email, and password', 400);
      return;
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      customRes.error('User already exists with this email', 400);
      return;
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser.id);

    customRes.success(
      {
        user: newUser,
        token,
      },
      'User registered successfully',
      201
    );
  } catch (error: any) {
    customRes.error(error.message || 'Error registering user', 500);
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const customRes = res as CustomResponse;
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      customRes.error('Please provide email and password', 400);
      return;
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      customRes.error('Invalid email or password', 401);
      return;
    }

    const isMatch = await comparePasswords(password, user.password as string);
    if (!isMatch) {
      customRes.error('Invalid email or password', 401);
      return;
    }

    const token = generateToken(user.id);

    customRes.success(
      {
        user,
        token,
      },
      'User logged in successfully'
    );
  } catch (error: any) {
    customRes.error(error.message || 'Error logging in', 500);
  }
};
