import * as ReviewModel from "../models/reviewModel.js";
import { success, error } from "../helpers/response.js";

export const getAllReviews = async (req, res) => {
    try {
        const reviews = await ReviewModel.getAllReviews();
        return success(res, reviews, "Reviews fetched successfully");
    } catch (err) {
        return error(res, err.message);
    }
};

export const getReviewById = async (req, res) => {
    try {
        const review = await ReviewModel.getReviewById(req.params.id);
        if (!review) {
            return error(res, "Review not found", 404);
        }
        return success(res, review, "Review fetched successfully");
    } catch (err) {
        return error(res, err.message);
    }
};

export const getReviewsByPost = async (req, res) => {
    try {
        const reviews = await ReviewModel.getReviewsByPost(req.params.id);
        return success(res, reviews, "Reviews for post fetched successfully");
    } catch (err) {
        return error(res, err.message);
    }
};

export const createReview = async (req, res) => {
    try {
        const { id, rating, comment } = req.body;
        if (!id || !rating) {
            return error(res, "id and rating are required", 400);
        }
        const review = await ReviewModel.createReview(id, rating, comment || null);
        return success(res, review, "Review created successfully");
    } catch (err) {
        return error(res, err.message);
    }
};

export const updateReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const updated = await ReviewModel.updateReview(req.params.id, rating, comment);
        if (!updated) {
            return error(res, "Review not found", 404);
        }
        return success(res, null, "Review updated successfully");
    } catch (err) {
        return error(res, err.message);
    }
};

export const deleteReview = async (req, res) => {
    try {
        const deleted = await ReviewModel.deleteReview(req.params.id);
        if (!deleted) {
            return error(res, "Review not found", 404);
        }
        return success(res, null, "Review deleted successfully");
    } catch (err) {
        return error(res, err.message);
    }
};

export const getAverageRating = async (req, res) => {
    try {
        const result = await ReviewModel.getAverageRating(req.params.id);
        return success(res, result || { avg_rating: null, total_reviews: 0 }, "Average rating fetched successfully");
    } catch (err) {
        return error(res, err.message);
    }
};
