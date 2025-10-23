import { DealerPostModel } from "../models/dealerPostModel.js";
import {error, success} from "../helpers/response.js";
import * as EquipmentPostModel from "../models/equipmentPostModel.js";

// Get all dealer posts
export const getAllDealerPosts = async (req, res) => {
    try {
        const posts = await DealerPostModel.getAll();
        return success(res, posts, "Dealer posts fetched successfully");
    } catch (err) {
        return error(res, err.message);
    }
};

export const getDealersTopRated = async (req, res) => {
    try {
        const posts = await DealerPostModel.getTopRated(); // pass threshold
        return success(res, posts);
    } catch (err) {
        return error(res, err.message);
    }
};

export const getDealersByName = async (req, res) => {
    try {
        const posts = await DealerPostModel.getByName(req.params.name); // pass threshold
        return success(res, posts);
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
    console.log("=== Request Body ===");
    console.log(req.body);

    console.log("=== Uploaded Files ===");
    console.log(req.files);

    try {
        // Handle logo
        const logoPath = req.files?.logo
            ? "/" + req.files.logo[0].path.replace(/\\/g, "/")
            : null;

        // Handle multiple photos
        const photosPaths = req.files?.photos
            ? req.files.photos.map(file => "/" + file.path.replace(/\\/g, "/"))
            : [];

        // Prepare post data
        const postData = {
            dealer_id: req.body.dealer_id ?? null,
            name: req.body.name ?? null,
            password: req.body.password ?? null,
            logo: logoPath ?? null,
            photos: photosPaths.length ? JSON.stringify(photosPaths) : null,
            description: req.body.description ?? null,

            // ✅ category and subcategory info
            category_id: req.body.category_id ?? null,
            category_title: req.body.category_title ?? null,       // added
            subcategory_id: req.body.subcategory_id ?? null,
            subcategory_title: req.body.subcategory_title ?? null, // added

            email: req.body.email ?? null,
            phone: req.body.phone ?? null,
            whatsapp: req.body.whatsapp ?? null,
            website_url: req.body.website_url ?? null,

            address_line1: req.body.address_line1 ?? null,
            address_line2: req.body.address_line2 ?? null,
            city: req.body.city ?? null,
            country: req.body.country ?? null,

            location_map: req.body.location_map
                ? JSON.stringify(JSON.parse(req.body.location_map))
                : null,

            services: req.body.services
                ? JSON.stringify(JSON.parse(req.body.services))
                : null,

            services_starting_from: req.body.services_starting_from ?? null,

            working_hours: req.body.working_hours
                ? JSON.stringify(JSON.parse(req.body.working_hours))
                : null,

            rating: req.body.rating ?? 0,
            reviews_count: req.body.reviews_count ?? 0,
            verified: req.body.verified ?? 0,
            established_year: req.body.established_year ?? null,
            featured: req.body.featured ?? 0,

            tags: req.body.tags
                ? JSON.stringify(JSON.parse(req.body.tags))
                : null,
        };

        console.log("=== Prepared Post Data ===");
        console.log(postData);

        // Validate required fields
        if (!postData.name || !postData.category_id || !postData.subcategory_id) {
            return res.status(400).json({ error: "Name, category_id, and subcategory_id are required" });
        }

        const post = await DealerPostModel.create(postData);

        return res.status(201).json({
            status: "success",            // matches your registration example
            code: 201,
            message: "Dealer post created successfully",
            data: post
        });
    } catch (err) {
        console.error("=== createDealerPost Error ===", err);
        return res.status(500).json({
            status: "error",
            code: 500,
            message: err.message,
        });
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
