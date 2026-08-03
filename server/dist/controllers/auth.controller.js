"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const User_1 = require("../models/User");
const auth_1 = require("../utils/auth");
const registerUser = async (req, res) => {
    const customRes = res;
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            customRes.error('Please provide name, email, and password', 400);
            return;
        }
        const existingUser = await User_1.UserModel.findOne({ email });
        if (existingUser) {
            customRes.error('User already exists with this email', 400);
            return;
        }
        const hashedPassword = await (0, auth_1.hashPassword)(password);
        const newUser = await User_1.UserModel.create({
            name,
            email,
            password: hashedPassword,
        });
        const token = (0, auth_1.generateToken)(newUser.id);
        customRes.success({
            user: newUser,
            token,
        }, 'User registered successfully', 201);
    }
    catch (error) {
        customRes.error(error.message || 'Error registering user', 500);
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    const customRes = res;
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            customRes.error('Please provide email and password', 400);
            return;
        }
        const user = await User_1.UserModel.findOne({ email });
        if (!user) {
            customRes.error('Invalid email or password', 401);
            return;
        }
        const isMatch = await (0, auth_1.comparePasswords)(password, user.password);
        if (!isMatch) {
            customRes.error('Invalid email or password', 401);
            return;
        }
        const token = (0, auth_1.generateToken)(user.id);
        customRes.success({
            user,
            token,
        }, 'User logged in successfully');
    }
    catch (error) {
        customRes.error(error.message || 'Error logging in', 500);
    }
};
exports.loginUser = loginUser;
