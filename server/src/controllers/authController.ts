import { Request, Response } from "express";
import User from "../models/User";
import generateToken from "../utils/generateToken";
import asyncHandler from "../utils/asyncHandler";
import { AuthRequest } from "../middleware/authMiddleware";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });

  if (exists) {
    res.status(400).json({
      success: false,
      message: "User already exists",
    });

    return;
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token: generateToken(user.id),
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });

    return;
  }

  res.json({
    success: true,
    message: "Login successful",
    token: generateToken(user.id),
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const getProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.user?.id).select("-password");

    res.json({
      success: true,
      message: "Profile retrieved successfully",
      data: user,
    });
  }
);
