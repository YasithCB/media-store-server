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