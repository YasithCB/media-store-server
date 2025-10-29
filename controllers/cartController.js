import * as CartModel from "../models/cartModel.js";
import { success, error } from "../helpers/response.js";

// Get all cart items for a user
export const getAllCartByUser = async (req, res) => {
    const { id } = req.params;
    try {
        const cartItems = await CartModel.getCartByUser(id);
        return success(res, cartItems, "Cart fetched successfully");
    } catch (err) {
        console.error(err);
        return error(res, err.message);
    }
};

// Add a product to cart (or increase quantity if exists)
export const addCartItem = async (req, res) => {
    const { user_id, product_id, post_category, quantity } = req.body;
    try {
        if (!user_id || !product_id || !post_category) {
            return error(res, "Missing required fields");
        }

        const result = await CartModel.addToCart(
            user_id,
            product_id,
            post_category,
            quantity || 1
        );

        return success(res, result, "Item added to cart successfully");
    } catch (err) {
        console.error(err);
        return error(res, err.message);
    }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    try {
        if (!user_id || !product_id || typeof quantity === "undefined") {
            return error(res, "Missing required fields");
        }

        const successUpdate = await CartModel.updateCartQuantity(
            user_id,
            product_id,
            quantity
        );

        return success(res, null, successUpdate ? "Quantity updated successfully" : "Item not found");
    } catch (err) {
        console.error(err);
        return error(res, err.message);
    }
};

// Remove a cart item
export const removeCartItem = async (req, res) => {
    const { user_id, product_id, post_category } = req.body;
    try {
        if (!user_id || !product_id) {
            return error(res, "Missing required fields");
        }

        const successRemove = await CartModel.removeFromCart(user_id, product_id, post_category);
        return success(res, null, successRemove ? "Item removed successfully" : "Item not found");
    } catch (err) {
        console.error(err);
        return error(res, err.message);
    }
};

// Clear entire cart for a user
export const clearUserCart = async (req, res) => {
    const { user_id } = req.body;
    try {
        if (!user_id) return error(res, "Missing user_id");

        const cleared = await CartModel.clearCart(user_id);
        return success(res, null, cleared ? "Cart cleared successfully" : "Cart already empty");
    } catch (err) {
        console.error(err);
        return error(res, err.message);
    }
};
