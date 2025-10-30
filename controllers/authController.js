import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel.js";
import {error, success} from "../helpers/response.js";
import {sendEmail} from "../utils/email.js";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";
const JWT_EXPIRES = "7d";

// Register
export const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // check existing user
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) return error(res, "Email already registered", 400);

        const hashedPassword = await bcrypt.hash(password, 10);

        // get uploaded file path if exists
        let profile_picture = null;
        if (req.file) {
            profile_picture = `/uploads/users/${req.file.filename}`;
        }

        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword,
            phone,
            profile_picture,
        });

        const token = jwt.sign({ user_id: user.user_id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES,
        });

        return success(res, { token, user }, "Registration successful", 201);
    } catch (err) {
        return error(res, err.message);
    }
};

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findByEmail(email);
        console.log('' +
            'login user',user )
        if (!user) return error(res, "Invalid email or password", 401);

        const hash = await bcrypt.hash(password, 10);
        console.log(hash);

        console.log('Input password:', password);
        console.log('Stored hash:', user.password);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match?', isMatch);
        if (!isMatch) return error(res, "Invalid email or password", 401);

        const token = jwt.sign({ user_id: user.user_id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
        return success(res, { token, user }, "Login successful");
    } catch (err) {
        return error(res, err.message);
    }
};

// Get profile
export const getProfile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.user_id);
        if (!user) return error(res, "User not found", 404);
        return success(res, user, "Profile fetched successfully");
    } catch (err) {
        return error(res, err.message);
    }
};

// Update profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.body.user_id;
        if (!userId) return error(res, "User ID missing", 400);

        let updateData = { ...req.body };

        if (req.file) {
            // Convert Windows "\" to "/" and ensure it starts with "/"
            let filePath = req.file.path.replace(/\\/g, "/");
            if (!filePath.startsWith("/")) {
                filePath = "/" + filePath;
            }
            updateData.profile_picture = filePath;
        }

        const affected = await UserModel.update(userId, updateData);
        if (!affected) return error(res, "Profile update failed", 400);

        // Fetch updated user
        const updatedUser = await UserModel.findById(userId);

        return success(res, updatedUser, "Profile updated successfully");
    } catch (err) {
        return error(res, err.message);
    }
};


export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findByEmail(email);
        if (!user) return error(res, "User not found", 404);

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        await UserModel.saveResetOTP(user.user_id, otp);

        const html = `<p>Your password reset OTP is: <b>${otp}</b></p><p>This OTP is valid for 5 minutes.</p>`;
        const sent = await sendEmail(email, "Password Reset OTP", html);

        if (!sent) return error(res, "Failed to send OTP", 500);

        return success(res, { otpSent: true }, "OTP sent to your email");
    } catch (err) {
        return error(res, err.message);
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        console.log(email)
        console.log(otp)

        const user = await UserModel.findByEmail(email);
        if (!user) return error(res, "User not found", 404);

        const valid = await UserModel.verifyResetOTP(user.user_id, otp);
        if (!valid) return error(res, "Invalid or expired OTP", 400);

        // Generate a reset token (temporary)
        const resetToken = Math.random().toString(36).substring(2, 12);
        await UserModel.saveResetToken(user.user_id, resetToken);

        return success(res, { resetToken }, "OTP verified");
    } catch (err) {
        return error(res, err.message);
    }
};

export const resetPassword = async (req, res) => {
    console.log(req.body)
    try {
        const { token, newPassword } = req.body;

        const user = await UserModel.findByResetToken(token);
        if (!user) return error(res, "Invalid or expired reset token", 400);

        const hashed = await bcrypt.hash(newPassword, 10);
        await UserModel.updatePassword(user.user_id, hashed);

        return success(res, null, "Password reset successful");
    } catch (err) {
        return error(res, err.message);
    }
};


