import { pool } from "../db.js";

export const getAllReviews = async () => {
    const [rows] = await pool.query("SELECT * FROM reviews");
    return rows;
};

export const getReviewById = async (id) => {
    const [rows] = await pool.query("SELECT * FROM reviews WHERE id = ?", [id]);
    return rows[0];
};

export const getReviewsByPost = async (id) => {
    const [rows] = await pool.query("SELECT * FROM reviews WHERE id = ?", [id]);
    return rows;
};

export const createReview = async (id, rating, comment) => {
    const [result] = await pool.query(
        "INSERT INTO reviews (id, rating, comment) VALUES (?, ?, ?)",
        [id, rating, comment]
    );
    return { review_id: result.insertId };
};

export const updateReview = async (id, rating, comment) => {
    const [result] = await pool.query(
        "UPDATE reviews SET rating = ?, comment = ? WHERE id = ?",
        [rating, comment, id]
    );
    return result.affectedRows;
};

export const deleteReview = async (id) => {
    const [result] = await pool.query("DELETE FROM reviews WHERE id = ?", [id]);
    return result.affectedRows;
};

export const getAverageRating = async (id) => {
    const [rows] = await pool.query(
        "SELECT id, AVG(rating) AS avg_rating, COUNT(*) AS total_reviews FROM reviews WHERE id = ?",
        [id]
    );
    return rows[0];
};
