import { pool } from "../db.js";

// Get all posts
export const getAllPosts = async () => {
    const [rows] = await pool.query(
        `SELECT p.*,
                u.name AS user_name,
                sc.name AS subcategory_name,
                COALESCE(AVG(r.rating), 0) AS avg_rating,
                COUNT(r.review_id) AS total_reviews
         FROM posts p
                  JOIN user u ON p.user_id = u.user_id
                  JOIN subcategories sc ON p.subcategory_id = sc.subcategory_id
                  LEFT JOIN reviews r ON p.post_id = r.post_id
         GROUP BY p.post_id
         ORDER BY avg_rating DESC, total_reviews DESC`
    );
    return rows;
};


export const getPostsByRating = async (minRating) => {
    const [rows] = await pool.query(
        "SELECT * FROM posts WHERE rating > ? ORDER BY rating DESC",
        [minRating]
    );
    return rows;
};

export const getPostsByCategoryId = async (categoryId) => {
    const [rows] = await pool.query(
        `SELECT p.*, u.name AS user_name, sc.name AS subcategory_name, c.name AS category_name
         FROM posts p
                  JOIN user u ON p.user_id = u.user_id
                  JOIN subcategories sc ON p.subcategory_id = sc.subcategory_id
                  JOIN categories c ON p.category_id = c.category_id
         WHERE p.category_id = ?`,
        [categoryId]
    );
    return rows;
};

// Get posts by subcategory
export const getPostsBySubcategoryId = async (subcategoryId) => {
    const [rows] = await pool.query(
        `SELECT p.*,
                u.name AS user_name,
                COALESCE(AVG(r.rating), 0) AS avg_rating,
                COUNT(r.review_id) AS total_reviews
         FROM posts p
                  JOIN user u ON p.user_id = u.user_id
                  LEFT JOIN reviews r ON p.post_id = r.post_id
         WHERE p.subcategory_id = ?
         GROUP BY p.post_id
         ORDER BY avg_rating DESC, total_reviews DESC`,
        [subcategoryId]
    );
    return rows;
};

// Get post by ID
export const getPostById = async (postId) => {
    const [rows] = await pool.query(
        `SELECT p.*, u.name AS user_name, sc.name AS subcategory_name
         FROM posts p
         JOIN user u ON p.user_id = u.user_id
         JOIN subcategories sc ON p.subcategory_id = sc.subcategory_id
         WHERE p.post_id = ?`,
        [postId]
    );
    return rows[0];
};

// Create post
export const createPost = async ({ user_id, subcategory_id, title, description, price, media }) => {
    const [result] = await pool.query(
        `INSERT INTO posts (user_id, subcategory_id, title, description, price, media, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [user_id, subcategory_id, title, description, price, JSON.stringify(media)]
    );
    return { post_id: result.insertId };
};

// Update post
export const updatePost = async (postId, { subcategory_id, title, description, price, media }) => {
    const [result] = await pool.query(
        `UPDATE posts
         SET subcategory_id = ?, title = ?, description = ?, price = ?, media = ?, updated_at = NOW()
         WHERE post_id = ?`,
        [subcategory_id, title, description, price, JSON.stringify(media), postId]
    );
    return result.affectedRows;
};

// Delete post
export const deletePost = async (postId) => {
    const [result] = await pool.query(
        `DELETE FROM posts WHERE post_id = ?`,
        [postId]
    );
    return result.affectedRows;
};
