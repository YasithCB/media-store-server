import express from "express";
import * as JobPostController from "../controllers/jobPostController.js";

const router = express.Router();

router.get("/", JobPostController.getAllJobPosts);
router.get("/:id", JobPostController.getJobPostById);
router.get("/subcategory/:subcategoryId", JobPostController.getJobPostsBySubcategoryId);
router.post("/", JobPostController.createJobPost);
router.put("/:id", JobPostController.updateJobPost);
router.delete("/:id", JobPostController.deleteJobPost);

export default router;
