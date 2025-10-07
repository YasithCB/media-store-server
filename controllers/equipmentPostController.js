import * as EquipmentPostModel from "../models/equipmentPostModel.js";
import { success, error } from "../helpers/response.js";

// equipmentPostController.js
export const getAllEquipmentPosts = async (req, res) => {
    console.log("GET /equipment-posts hit"); // debug log
    try {
        const posts = await EquipmentPostModel.getAllEquipmentPosts();
        return success(res, posts, "Equipment posts fetched successfully");
    } catch (err) {
        console.error(err);
        return error(res, err.message);
    }
};


// Get single equipment post
export const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await EquipmentPostModel.getEquipmentPostById(id);
        if (!post) return error(res, "Post not found", 404);
        return success(res, post, "Equipment post fetched successfully");
    } catch (err) {
        return error(res, err.message);
    }
};

// Get equipment posts by subcategory ID
export const getPostsBySubcategoryId = async (req, res) => {
    try {
        const { subcategoryId } = req.params;
        const posts = await EquipmentPostModel.getEquipmentPostsBySubcategoryId(subcategoryId);
        return success(res, posts, "Equipment posts by subcategory fetched successfully");
    } catch (err) {
        return error(res, err.message);
    }
};

// Create new equipment post
export const createEquipmentPost = async (req, res) => {
    try {
        const postData = {
            ...req.body,
            photos: req.files ? req.files.map(f => f.path) : []
        };

        const result = await EquipmentPostModel.createEquipmentPost(postData);
        return success(res, result, "Equipment post created successfully", 201);
    } catch (err) {
        return error(res, err.message);
    }
};

// Update equipment post
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await EquipmentPostModel.updateEquipmentPost(id, req.body);
        if (!updated) return error(res, "Post not found or not updated", 404);
        return success(res, null, "Equipment post updated successfully");
    } catch (err) {
        return error(res, err.message);
    }
};

// Delete equipment post
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await EquipmentPostModel.deleteEquipmentPost(id);
        if (!deleted) return error(res, "Post not found", 404);
        return success(res, null, "Equipment post deleted successfully");
    } catch (err) {
        return error(res, err.message);
    }
};
