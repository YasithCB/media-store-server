import { pool } from "../db.js";

export const getAllCategories = async () => {
    const [rows] = await pool.execute("SELECT * FROM categories ORDER BY name ASC");
    return rows;
};

export const getCategoryById = async (id) => {
    const [rows] = await pool.execute("SELECT * FROM categories WHERE category_id = ?", [id]);
    return rows[0] || null;
};

export const createCategory = async (name, description, icon, image) => {
    const [result] = await pool.execute(
        "INSERT INTO categories (name, description, icon, image) VALUES (?, ?, ?, ?)",
        [name, description, icon, image]
    );
    return result.insertId;
};

export const updateCategory = async (id, name, description, icon, image) => {
    const [result] = await pool.execute(
        "UPDATE categories SET name = ?, description = ?, icon = ?, image = ?, updated_at = CURRENT_TIMESTAMP WHERE category_id = ?",
        [name, description, icon, image, id]
    );
    return result.affectedRows;
};

export const deleteCategory = async (id) => {
    const [result] = await pool.execute(
        "DELETE FROM categories WHERE category_id = ?",
        [id]
    );
    return result.affectedRows;
};
