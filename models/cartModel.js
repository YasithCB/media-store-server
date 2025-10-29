import { pool } from "../db.js";

// 🗺️ Optional: category → table mapping (for retrieving product details)
const categoryMap = {
    "Equipment and Machinery": "equipment_post",
    "Jobs": "job_post",
    "Top Dealers": "dealer",
    "Studios": "studio",
};

// 🔍 Helper: Get product/post details
const getPostById = async (postType, postId) => {
    const tableName = categoryMap[postType];
    if (!tableName) throw new Error("Invalid category title");

    const [rows] = await pool.execute(
        `SELECT * FROM ${tableName} WHERE id = ? LIMIT 1`,
        [postId]
    );
    return rows[0] || null;
};

/**
 * 🧾 Get all cart items for a user
 */
export const getCartByUser = async (userId) => {
    const [cartRows] = await pool.execute(
        `SELECT * FROM cart WHERE user_id = ? ORDER BY created_at DESC`,
        [userId]
    );

    // Attach product/post data
    const cartWithDetails = await Promise.all(
        cartRows.map(async (entry) => {
            const product = await getPostById(entry.post_category, entry.product_id);
            if (!product) return null;

            // Parse photos safely
            let photos = product.photos;
            if (typeof photos === "string") {
                try {
                    photos = JSON.parse(photos);
                } catch (err) {
                    console.error("Failed to parse photos:", photos, err);
                    photos = [];
                }
            }

            return {
                ...product,
                photos,
                cart_id: entry.id,
                quantity: entry.quantity,
                added_at: entry.created_at,
            };
        })
    );

    return cartWithDetails.filter(Boolean);
};

/**
 * ➕ Add or update a cart item
 * (If exists → update quantity, else insert new)
 */
export const addToCart = async (userId, productId, postCategory, quantity = 1) => {
    try {
        if (!categoryMap[postCategory]) throw new Error("Invalid category title");

        // Insert new or update existing quantity
        const [result] = await pool.execute(
            `
            INSERT INTO cart (user_id, product_id, post_category, quantity)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
            `,
            [userId, productId, postCategory, quantity]
        );

        return {
            user_id: userId,
            product_id: productId,
            post_category: postCategory,
            quantity,
        };
    } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
    }
};

/**
 * 🔁 Update item quantity directly
 */
export const updateCartQuantity = async (userId, productId, quantity) => {
    try {
        const [result] = await pool.execute(
            `UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?`,
            [quantity, userId, productId]
        );
        return result.affectedRows === 1;
    } catch (error) {
        console.error("Error updating cart quantity:", error);
        throw error;
    }
};

/**
 * ❌ Remove item from cart
 */
export const removeFromCart = async (userId, productId, postCategory) => {
    try {
        // Validate category
        if (!categoryMap[postCategory]) throw new Error("Invalid category title");

        if (!userId || !productId || !postCategory) {
            throw new Error("Missing required parameters");
        }

        const [result] = await pool.execute(
            `DELETE FROM cart WHERE user_id = ? AND product_id = ? AND post_category = ?`,
            [userId, productId, postCategory]
        );

        // result.affectedRows === 1 if deleted, 0 if not found
        return result.affectedRows === 1;
    } catch (error) {
        console.error("Error removing from cart:", error);
        throw error;
    }
};

/**
 * 🧹 Clear full cart (e.g., after checkout)
 */
export const clearCart = async (userId) => {
    try {
        const [result] = await pool.execute(
            `DELETE FROM cart WHERE user_id = ?`,
            [userId]
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error("Error clearing cart:", error);
        throw error;
    }
};
