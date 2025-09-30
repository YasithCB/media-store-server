import * as postModel from "../models/postModels.js";
import {error, success} from "../helpers/response.js";

export const getPosts = async (req, res) => {
    try {
        const posts = await postModel.getAllPosts();
        return success(res, posts);
    } catch (err) {
        return error(res, err.message);
    }
};

export const getHighRatedPosts = async (req, res) => {
    try {
        const posts = await postModel.getPostsByRating(3); // pass threshold
        console.log(posts);
        return success(res, posts);
    } catch (err) {
        console.log(err);
        return error(res, err.message);
    }
};


export const getPostsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const posts = await postModel.getPostsByCategoryId(categoryId);
        return success(res, posts, "Posts by category fetched successfully");
    } catch (err) {
        return error(res, err.message);
    }
};


export const getPostsBySubcategory = async (req, res) => {
    try {
        const { subcategoryId } = req.params;
        const posts = await postModel.getPostsBySubcategoryId(subcategoryId);
        return success(res, posts);
    } catch (err) {
        return error(res, err.message);
    }
};

export const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await postModel.getPostById(id);
        if (!post) return error(res, "Post not found", 404);
        return success(res, post);
    } catch (err) {
        return error(res, err.message);
    }
};

export const addPost = async (req, res) => {
    try {
        const { user_id, subcategory_id, title, description, price, media } = req.body;
        const result = await postModel.createPost({ user_id, subcategory_id, title, description, price, media });
        return success(res, result, "Post created", 201);
    } catch (err) {
        return error(res, err.message);
    }
};

export const editPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { subcategory_id, title, description, price, media } = req.body;
        const result = await postModel.updatePost(id, { subcategory_id, title, description, price, media });
        if (!result) return error(res, "Update failed", 400);
        return success(res, { updated: result }, "Post updated");
    } catch (err) {
        return error(res, err.message);
    }
};

export const removePost = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await postModel.deletePost(id);
        if (!result) return error(res, "Delete failed", 400);
        return success(res, { deleted: result }, "Post deleted");
    } catch (err) {
        return error(res, err.message);
    }
};
