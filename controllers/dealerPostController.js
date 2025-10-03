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
    console.log(req.body);
    console.log(req.files);

    try {
        const logoPath = req.files.logo
            ? "/" + req.files.logo[0].path.replace(/\\/g, "/")
            : null;

        const photosPaths = req.files.photos
            ? req.files.photos.map(file => "/" + file.path.replace(/\\/g, "/"))
            : null;

        const postData = {
            ...req.body,
            logo: logoPath,
            photos: photosPaths ? JSON.stringify(photosPaths) : null,
            services: req.body.services ? JSON.parse(req.body.services) : null,
            tags: req.body.tags ? JSON.parse(req.body.tags) : null,
            social_links: req.body.social_links ? JSON.stringify(req.body.social_links) : null,
            location_map: req.body.location_map ? JSON.stringify(req.body.location_map) : null,
            working_hours: req.body.working_hours ? JSON.stringify(req.body.working_hours) : null,
            rating: req.body.rating ?? 0,
            reviews_count: req.body.reviews_count ?? 0,
            verified: req.body.verified ?? 0,
            featured: req.body.featured ?? 0,
        };

        // Ensure no undefined values
        for (const key in postData) {
            if (postData[key] === undefined) {
                postData[key] = null;
            }
        }

        const post = await DealerPostModel.create(postData);

        return success(res, post, "Dealer post created successfully");
    } catch (err) {
        console.error(err);
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
