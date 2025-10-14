import express from "express";
import * as JobPostController from "../controllers/jobPostController.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/job-hiring-company-logos"); // Folder to store logos
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Routes
router.get("/", JobPostController.getAllJobPosts);
router.get("/hiring", JobPostController.getJobHiring);
router.get("/:id", JobPostController.getJobPostById);
router.get("/name/:name", JobPostController.getJobsByName);
router.get("/subcategory/:subcategoryId", JobPostController.getJobPostsBySubcategoryId);

// ✅ Updated route to handle file upload
router.post("/", upload.single("logo"), JobPostController.createJobPost);

router.put("/:id", JobPostController.updateJobPost);
router.delete("/:id", JobPostController.deleteJobPost);

export default router;
