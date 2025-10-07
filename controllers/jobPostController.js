import * as JobPostModel from "../models/jobPostModel.js";
import { error, success } from "../helpers/response.js";

export const getAllJobPosts = async (req, res) => {
    try {
        const posts = await JobPostModel.getAllJobPosts();
        return success(res, posts, "Job posts fetched successfully");
    } catch (err) {
        return error(res, err.message);
    }
};

export const getJobPostsBySubcategoryId = async (req, res) => {
    try {
        const { subcategoryId } = req.params;
        const posts = await JobPostModel.getJobPostsBySubcategoryId(subcategoryId);
        return success(res, posts, "Job posts by subcategory fetched successfully");
    } catch (err) {
        return error(res, err.message);
    }
};

export const getJobPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await JobPostModel.getJobPostById(id);
        if (!post) return error(res, "Job post not found", 404);
        return success(res, post);
    } catch (err) {
        return error(res, err.message);
    }
};

export const createJobPost = async (req, res) => {
    try {
        console.log("REQ FILE:", req.file);
        console.log("REQ BODY:", req.body);

        const postData = {
            ...req.body,
            logo: req.file ? req.file.path : null,
            expiry_date: req.body.expiry_date && req.body.expiry_date.trim() !== ""
                ? req.body.expiry_date
                : null
        };

        console.log("FINAL POST DATA:", postData);

        const result = await JobPostModel.createJobPost(postData);
        return success(res, result, "Job post created successfully", 201);
    } catch (err) {
        console.error(err);
        return error(res, err.message);
    }
};




export const updateJobPost = async (req, res) => {
    try {
        const { id } = req.params;
        const postData = req.body;
        const result = await JobPostModel.updateJobPost(id, postData);
        if (!result.affectedRows) return error(res, "Update failed", 400);
        return success(res, result, "Job post updated successfully");
    } catch (err) {
        return error(res, err.message);
    }
};

export const deleteJobPost = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await JobPostModel.deleteJobPost(id);
        if (!result.affectedRows) return error(res, "Delete failed", 400);
        return success(res, result, "Job post deleted successfully");
    } catch (err) {
        return error(res, err.message);
    }
};
