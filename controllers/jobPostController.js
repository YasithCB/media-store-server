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
        const posts = await JobPostModel.getBySubcategoryId(subcategoryId);
        return success(res, posts, "Job posts by subcategory fetched successfully");
    } catch (err) {
        return error(res, err.message);
    }
};

export const getJobHiring = async (req, res) => {
    try {
        const posts = await JobPostModel.getHiring();
        return success(res, posts, "Hiring Jobs fetched successfully");
    } catch (err) {
        return error(res, err.message);
    }
};

export const getJobsByName = async (req, res) => {
    try {
        const posts = await JobPostModel.getByName(req.params.name);
        return success(res, posts, `Jobs by name : ${req.params.name} | fetched successfully`);
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
        const postData = {
            ...req.body,
            logo: req.file ? req.file.path : null,
            expiry_date: req.body.expiry_date && req.body.expiry_date.trim() !== ""
                ? req.body.expiry_date
                : null
        };

        const result = await JobPostModel.createJobPost(postData);
        return success(res, result, "Job post created successfully", 201);
    } catch (err) {
        console.error(err);
        return error(res, err.message);
    }
};

// req.file -> single file upload (logo)
export const updateJobPost = async (req, res) => {
    try {
        const postId = req.params.id;

        // Prepare post data
        const postData = { ...req.body };

        // Handle logo file
        if (req.file) {
            postData.logo = req.file.path;
        } else if (req.body.logo === undefined) {
            postData.logo = null;
        }

        // Parse JSON fields safely
        if (req.body.tags) {
            try {
                postData.tags = JSON.parse(req.body.tags);
            } catch {
                postData.tags = [];
            }
        } else {
            postData.tags = [];
        }

        // Boolean fields
        postData.remote = postData.remote === "1" || postData.remote === 1 || postData.remote === true ? 1 : 0;
        postData.is_hiring = postData.is_hiring === "1" || postData.is_hiring === 1 || postData.is_hiring === true ? 1 : 0;

        // Allowed columns to update (exclude id, created_at)
        const allowedFields = [
            "title", "company_name", "logo", "location", "country", "job_type", "industry",
            "experience_level", "salary", "salary_type", "description", "posted_date",
            "email", "phone", "application_url", "remote", "tags", "category_id", "subcategory_id",
            "is_hiring"
        ];


        const fieldsToUpdate = {};
        for (const [key, val] of Object.entries(postData)) {
            if (!allowedFields.includes(key)) continue;
            fieldsToUpdate[key] = val === undefined ? null : val;
        }

        // Update the job post
        const updated = await JobPostModel.updateJobPost(postId, fieldsToUpdate);

        if (!updated) {
            return res.status(404).json({ status: "error", message: "Post not found or not updated" });
        }

        return res.status(200).json({
            status: "success",
            data: null,
            message: "Job post updated successfully"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: "error", message: err.message });
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
