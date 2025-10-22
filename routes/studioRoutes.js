import express from "express";
import * as StudioController from "../controllers/studioController.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Ensure upload directory exists
const uploadDir = "uploads/studios";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage });

// Routes
router.post(
    "/",
    upload.array("photos", 10), // changed to .array so it's easier to handle
    StudioController.createStudio
);

router.get("/", StudioController
    .getAllStudios);

export default router;
