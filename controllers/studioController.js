import * as StudioModel from "../models/studioModel.js";
import { success, error } from "../helpers/response.js";

// get all studios
export const getAllStudios = async (req, res) => {
    try {
        const posts = await StudioModel.getAllStudios();
        return success(res, posts, "Studios fetched successfully");
    } catch (err) {
        console.error(err);
        return error(res, err.message);
    }
};

// Create new studio post
export const createStudio = async (req, res) => {
    try {
        const postData = {
            ...req.body,
            photos: req.files ? req.files.map(f => f.path) : []
        };

        const result = await StudioModel.createStudio(postData);
        return success(res, result, "Studio post created successfully", 201);
    } catch (err) {
        return error(res, err.message);
    }
};

// Update existing studio post
export const updateStudio = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                status: "error",
                message: "Studio ID is required",
            });
        }

        // Replace photos completely
        let photosArray = [];
        if (req.files?.length > 0) {
            // Only use newly uploaded photos
            photosArray = req.files.map(f => f.path);
        } else if (req.body.photos) {
            // If frontend sends a list of photos to replace
            photosArray = Array.isArray(req.body.photos) ? req.body.photos : [req.body.photos];
        } else {
            photosArray = []; // No photos
        }

        // Build safe updateData (replace undefined with null)
        const updateData = {};
        for (const [key, value] of Object.entries(req.body)) {
            updateData[key] = value === undefined ? null : value;
        }

        // Assign to updateData
        updateData.photos = photosArray;

        // Convert checkbox-like values (if exist)
        ["is_rent", "is_used"].forEach(key => {
            if (updateData[key] !== undefined) {
                updateData[key] =
                    updateData[key] === true ||
                    updateData[key] === "true" ||
                    updateData[key] === 1 ||
                    updateData[key] === "1"
                        ? 1
                        : 0;
            }
        });

        // Call model
        const updated = await StudioModel.updateStudioById(id, updateData);

        if (!updated) {
            return res.status(404).json({
                status: "error",
                message: "Studio not found or not updated",
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Studio post updated successfully",
        });
    } catch (err) {
        console.error("updateStudio error:", err);
        return res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
};


