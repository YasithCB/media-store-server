import { DealerPostModel } from "../models/dealerPostModel.js";
import {error, success} from "../helpers/response.js";

// Get all dealer posts
export const getAllDealerPosts = async (req, res) => {
    try {
        const posts = await DealerPostModel.getAll();
        return success(res, posts, "Dealer posts fetched successfully");
    } catch (err) {
        return error(res, err.message);
    }
};

// Get dealer post by ID
export const getDealerPostById = async (req, res) => {
    try {
        const post = await DealerPostModel.getById(req.params.id);
        if (!post) return error(res, "Dealer post not found", 404);
        return success(res, post, "Dealer post fetched successfully");
    } catch (err) {
        return error(res, err.message);
    }
};

// Get posts by subcategory ID
export const getDealerPostsBySubcategoryId = async (req, res) => {
    try {
        const posts = await DealerPostModel.getBySubcategory(req.params.subcategoryId);
        return success(res, posts, "Dealer posts by subcategory fetched successfully");
    } catch (err) {
        return error(res, err.message);
    }
};

// Create new dealer post
export const createDealerPost = async (req, res) => {
    try {
        const post = await DealerPostModel.create(req.body);
        return success(res, post, "Dealer post created successfully");
    } catch (err) {
        return error(res, err.message);
    }
};

// Update dealer post
export const updateDealerPost = async (req, res) => {
    try {
        const affected = await DealerPostModel.update(req.params.id, req.body);
        if (!affected) return error(res, "Dealer post not found", 404);
        return success(res, null, "Dealer post updated successfully");
    } catch (err) {
        return error(res, err.message);
    }
};

// Delete dealer post
export const deleteDealerPost = async (req, res) => {
    try {
        const affected = await DealerPostModel.delete(req.params.id);
        if (!affected) return error(res, "Dealer post not found", 404);
        return success(res, null, "Dealer post deleted successfully");
    } catch (err) {
        return error(res, err.message);
    }
};
