import { pool } from "../db.js";

// ✅ Get all subcategories
export const getAllSubCategories = async () => {
    const [rows] = await pool.query(
        `SELECT sc.*, c.name AS category_name, c.image AS category_image
         FROM subcategories sc
         JOIN categories c ON sc.category_id = c.id`
    );
    return rows;
};

export const getSubCategoriesByCategoryId = async (categoryId) => {
    const [rows] = await pool.query(
        `SELECT sc.*, c.name AS category_name, c.image AS category_image
         FROM subcategories sc
         JOIN categories c ON sc.category_id = c.id
         WHERE sc.category_id = ?`,
        [categoryId]
    );
    return rows;
};


// ✅ Get subcategory by ID
export const getSubCategoryById = async (id) => {
    const [rows] = await pool.query(
        `SELECT sc.*, c.name AS category_name, c.image AS category_image
         FROM subcategories sc
         JOIN categories c ON sc.category_id = c.id
         WHERE sc.id = ?`,
        [id]
    );
    return rows[0];
};

// ✅ Create subcategory
export const createSubCategory = async ({ category_id, name, description, image }) => {
    const [result] = await pool.query(
        `INSERT INTO subcategories (category_id, name, description, image, created_at, updated_at)
         VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [category_id, name, description, image]
    );
    return { subcategory_id: result.insertId };
};

// ✅ Update subcategory
export const updateSubCategory = async (id, { category_id, name, description, image }) => {
    const [result] = await pool.query(
        `UPDATE subcategories 
         SET category_id = ?, name = ?, description = ?, image = ?, updated_at = NOW()
         WHERE id = ?`,
        [category_id, name, description, image, id]
    );
    return result.affectedRows;
};

// ✅ Delete subcategory
export const deleteSubCategory = async (id) => {
    const [result] = await pool.query(
        `DELETE FROM subcategories WHERE id = ?`,
        [id]
    );
    return result.affectedRows;
};
