import { pool } from "../db.js";

// Map frontend category titles to internal table names
const categoryMap = {
    "Equipment and Machinery": "equipment_post",
    "Jobs": "job_post",
    "Top Dealers": "dealer",
    "Studios": "studio",
};

// Utility to get post details by table and ID
const getPostById = async (postType, postId) => {
    // Validate category (important to prevent SQL injection)
    const tableName = categoryMap[postType];
    if (!tableName) throw new Error("Invalid category title");

    const [rows] = await pool.execute(
        `SELECT * FROM ${tableName} WHERE id = ? LIMIT 1`,
        [postId]
    );
    return rows[0] || null;
};

// Get wishlist for a specific user
export const getWishlistByUser = async (userId) => {
    // 1️⃣ Get wishlist entries for the user
    const [wishlistRows] = await pool.execute(
        `SELECT * FROM wishlist WHERE user_id = ? ORDER BY created_at DESC`,
        [userId]
    );

    // 2️⃣ Map each entry to full post object
    const wishlistWithPosts = await Promise.all(
        wishlistRows.map(async (entry) => {
            const post = await getPostById(entry.post_category, entry.post_id);

            if (!post) return null;

            // Parse photos if it's a string
            let photos = post.photos;
            if (typeof photos === "string") {
                try {
                    photos = JSON.parse(photos);
                } catch (err) {
                    console.error("Failed to parse photos:", photos, err);
                    photos = [];
                }
            }

            return {
                ...post,
                photos,
                wishlist_id: entry.id,
                added_at: entry.created_at,
            };
        })
    );
    // 3️⃣ Filter out nulls (deleted posts)
    return wishlistWithPosts.filter(Boolean);
};

/**
 * Add a post to the user's wishlist
 * @param {number} userId - ID of the user
 * @param {number} postId - ID of the post
 * @param {string} postCategory - category / table name of the post
 * @returns {object} - inserted row or null if already exists
 */
export const addToWishlist = async (userId, postId, postCategory) => {
    try {
        // Optional: validate category
        if (!categoryMap[postCategory]) throw new Error("Invalid category");

        const [result] = await pool.execute(
            `INSERT IGNORE INTO wishlist (user_id, post_id, post_category) VALUES (?, ?, ?)`,
            [userId, postId, postCategory]
        );

        return result.affectedRows === 1
            ? { user_id: userId, post_id: postId, post_category: postCategory }
            : null;
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        throw error;
    }
};


/**
 * Remove a post from the user's wishlist
 * @param {number} userId - ID of the user
 * @param {number} postId - ID of the post
 * @param {string} postCategory - category / table name of the post
 * @returns {boolean} - true if deleted, false if not found
 */
export const removeFromWishlist = async (userId, postId, postCategory) => {
    try {
        // Validate category (optional, same as addToWishlist)
        if (!categoryMap[postCategory]) throw new Error("Invalid category title");

        if (!userId || !postId || !postCategory) {
            throw new Error("Missing required parameters");
        }

        const [result] = await pool.execute(
            `DELETE FROM wishlist WHERE user_id = ? AND post_id = ? AND post_category = ?`,
            [userId, postId, postCategory]
        );

        // result.affectedRows === 1 if deleted, 0 if not found
        return result.affectedRows === 1;
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        throw error;
    }
};
