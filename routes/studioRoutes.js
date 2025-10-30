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

// save
router.post(
    "/",
    upload.array("photos", 10), // changed to .array so it's easier to handle
    StudioController.createStudio
);

// Update Studio by ID
router.put(
    "/:id",
    upload.array("photos", 10), // handle multiple photo uploads
    StudioController.updateStudio // make sure you implement this in your controller
);

router.get("/", StudioController
    .getAllStudios);

export default router;
