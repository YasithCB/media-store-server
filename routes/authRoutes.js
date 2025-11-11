import express from "express";
import * as AuthController from "../controllers/authController.js";
import {authenticate} from "../middlewares/authMiddleware.js";
import {upload} from "../middlewares/uploads.js";

const router = express.Router();

router.post("/register", upload.single("profile_picture"), AuthController.register);

router.post("/login/:role", AuthController.login);
router.get("/profile", authenticate, AuthController.getProfile);
router.put("/profile", upload.single("profile_picture"), AuthController.updateProfile);

// reset password
router.post("/forgot-password/:role", AuthController.sendResetCode);
router.post("/reset-password/:role", AuthController.resetPassword);

export default router;
