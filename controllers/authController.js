import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel.js";
import {error, success} from "../helpers/response.js";
import nodemailer from "nodemailer";
import {capitalizeFirstLetter} from "../utils/util.js";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";
const JWT_EXPIRES = "7d";

// Register
export const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // check existing user
        const existingUser = await UserModel.findByEmailUser(email);
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
    const role = req.params.role;

    try {
        const { email, password } = req.body;

        let user;

        if (role === 'user'){
            user = await UserModel.findByEmailUser(email);
        }else if (role === 'dealer'){
            user = await UserModel.findByEmailDealer(email);
        }

        if (!user) return error(res, `${capitalizeFirstLetter(role)} Not Found!`, 401);

        const hash = await bcrypt.hash(password, 10);
        console.log(hash);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return error(res, "Invalid password", 401);

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
    const { id } = req.params;

    try {
        const { name, email, phone, password } = req.body;

        let updateData = { name, email, phone };

        const affected = await UserModel.update(id, updateData);
        if (!affected) return error(res, "Profile update failed", 400);

        // Fetch updated user
        const updatedUser = await UserModel.findById(id);

        return success(res, updatedUser, "Profile updated successfully");
    } catch (err) {
        return error(res, err.message);
    }
};


// RESET / FORGOT PASSWORD ----------------------------------------------------

// Generate 6-digit OTP
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// Step 1: Send reset code
export const sendResetCode = async (req, res) => {
    const role = req.params.role;
    const { email } = req.body;

    try {
        let user;
        if (role === "user") {
            user = await UserModel.findByEmailUser(email);
        }else if (role === "dealer") {
            user = await UserModel.findByEmailDealer(email);
        }

        if (!user) return res.status(404).json({ message: `${capitalizeFirstLetter(role)} not found` });

        const code = generateCode();
        await UserModel.saveResetCode(email, code, role);

        // send mail
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: process.env.EMAILJS_MY_EMAIL, pass: process.env.EMAILJS_MY_EMAIL_PW },
        });

        await transporter.sendMail({
            from: `"Support Team" <${process.env.EMAILJS_MY_EMAIL}>`,
            to: email,
            subject: "🔐 Reset Your Password – Code Inside",
            html: `
            <div style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f7f8fa; padding: 40px 0;">
              <div style="max-width: 520px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.05);">
                
                <!-- Header -->
                <div style="background-color: #FFD700; padding: 24px; text-align: center;">
                  <h1 style="color: #000000; font-size: 24px; margin: 0;">Password Reset Request</h1>
                </div>
        
                <!-- Body -->
                <div style="padding: 32px; color: #333333;">
                  <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Hello,</p>
                  <p style="font-size: 15px; line-height: 1.6; color: #555;">
                    We received a request to reset your password. Use the following verification code to continue:
                  </p>
        
                  <!-- Code -->
                  <div style="text-align: center; margin: 30px 0;">
                    <div style="display: inline-block; background-color: #f4f5f7; color: #111; font-size: 28px; font-weight: 700; letter-spacing: 6px; padding: 18px 28px; border-radius: 8px; border: 1px solid #ddd;">
                      ${code}
                    </div>
                  </div>
        
                  <p style="font-size: 15px; line-height: 1.6; color: #555;">
                    This code will expire in <strong>15 minutes</strong>. If you did not request a password reset, please ignore this email — your account is safe.
                  </p>
        
                  <!-- Button -->
                  <div style="margin-top: 30px; text-align: center;">
                    <a href="#" style="display: inline-block; background-color: #FFD700; color: #000; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600;">
                      Reset Password
                    </a>
                  </div>
                </div>
        
                <!-- Footer -->
                <div style="background-color: #f4f5f7; padding: 16px; text-align: center; font-size: 13px; color: #777;">
                  <p style="margin: 0;">
                    If you have any questions, contact us at 
                    <a href="mailto:${process.env.EMAILJS_MY_EMAIL}" style="color: #111; text-decoration: none;">
                      ${process.env.EMAILJS_MY_EMAIL}
                    </a>.
                  </p>
                  <p style="margin-top: 4px;">&copy; ${new Date().getFullYear()} The Meat Shop. All rights reserved.</p>
                </div>
        
              </div>
            </div>
          `,
        });



        res.json({ message: "Reset code sent successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Step 2: Reset password
export const resetPassword = async (req, res) => {
    const role = req.params.role;
    const { email, code, newPassword } = req.body;

    try {
        const validUser = await UserModel.verifyResetCode(email, code, role);
        if (!validUser)
            return res.status(400).json({ message: "Invalid or expired code" });

        await UserModel.updatePassword(email, newPassword, role);
        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// REGISTRATION DATA VERIFICATION

// ==========================
// SEND OTP
// ==========================
export async function sendOtp(req, res) {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = Date.now() + 5 * 60 * 1000; // 5 min

        user.otp = otp;
        user.otp_expires_at = expires;
        await user.save();

        // OPTIONAL: send actual email
        // await sendEmail(email, `Your OTP is ${otp}`);

        return res.json({ message: "OTP sent successfully", otp }); // remove otp in production
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
// ==========================
// VERIFY OTP
// ==========================
export async function verifyOtp(req, res) {
    try {
        const { email, otp } = req.body;

        if (!email || !otp)
            return res.status(400).json({ message: "Email and OTP are required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.otp || !user.otp_expires_at)
            return res.status(400).json({ message: "OTP not generated" });

        if (user.otp_expires_at < Date.now())
            return res.status(400).json({ message: "OTP expired" });

        if (user.otp !== otp)
            return res.status(400).json({ message: "Invalid OTP" });

        // clear OTP after success
        user.otp = null;
        user.otp_expires_at = null;
        await user.save();

        return res.json({ message: "OTP verified successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


