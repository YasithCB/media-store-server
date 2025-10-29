import * as WishlistModel from "../models/wishlistModel.js";
import { success, error } from "../helpers/response.js";

// get all
export const getAllWishlistByUser = async (req, res) => {
    const { id } = req.params;
    try {
        const posts = await WishlistModel.getWishlistByUser(id);
        return success(res, posts, "Wishlist fetched successfully");
    } catch (err) {
        console.error(err);
        return error(res, err.message);
    }
};

// Add to wishlist
export const addToWishList = async (req, res) => {
    try {
        const { user_id ,post_id, post_category } = req.body;

        if (!post_id || !post_category) {
            return error(res, "post_id and post_category are required", 400);
        }

        // Call the model function
        const result = await WishlistModel.addToWishlist(user_id, post_id, post_category);

        if (!result) {
            // Already exists
            return success(res, null, "Item already in wishlist", 200);
        }

        return success(res, result, "Item added successfully", 201);
    } catch (err) {
        console.error("Add to wishlist error:", err);
        return error(res, err.message || "Server error");
    }
};

/**
 * Remove a post from the user's wishlist
 * @route DELETE /wishlist/remove/:postId
 * @body { user_id, post_id, post_category }
 */
export const removeFromWishList = async (req, res) => {
    try {
        const { user_id, post_id, post_category } = req.body;

        // ✅ Validate input
        if (!user_id) return error(res, "User ID is required", 400);
        if (!post_id) return error(res, "Post ID is required", 400);
        if (!post_category) return error(res, "Post category is required", 400);

        // Call the model function to delete
        const deleted = await WishlistModel.removeFromWishlist(user_id, post_id, post_category);

        if (!deleted) {
            return success(res, null, "Item not found in wishlist", 200);
        }

        return success(res, null, "Item removed from wishlist successfully", 200);
    } catch (err) {
        console.error("Remove from wishlist error:", err);
        return error(res, err.message || "Server error", 500);
    }
};