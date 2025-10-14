import express from "express";
import {
    getAllReviews,
    getReviewById,
    getReviewsByPost,
    createReview,
    updateReview,
    deleteReview,
    getAverageRating,
} from "../controllers/reviewController.js";

const router = express.Router();

// CRUD
router.get("/", getAllReviews);          // GET all reviews
router.get("/:id", getReviewById);       // GET review by ID
router.post("/", createReview);          // CREATE new review
router.put("/:id", updateReview);        // UPDATE review
router.delete("/:id", deleteReview);     // DELETE review

// Related to posts
router.get("/post/:id", getReviewsByPost);              // GET all reviews for a post
router.get("/post/:id/average", getAverageRating);      // GET avg rating + total reviews for a post

export default router;
