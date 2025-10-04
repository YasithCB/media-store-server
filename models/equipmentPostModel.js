import { pool } from "../db.js";
import { v4 as uuidv4 } from "uuid";

// Get all equipment posts
export const getAllEquipmentPosts = async () => {
    const [rows] = await pool.execute(
        `SELECT ep.*, c.name AS category_name, sc.name AS subcategory_name
         FROM equipment_post ep
                  JOIN categories c ON ep.category_id = c.category_id
                  JOIN subcategories sc ON ep.subcategory_id = sc.subcategory_id
         ORDER BY ep.created_at DESC`
    );

    return rows;
};


// Get single equipment post by ID
export const getEquipmentPostById = async (postId) => {
    const [rows] = await pool.execute(
        `SELECT ep.*, c.name AS category_name, sc.name AS subcategory_name
         FROM equipment_post ep
         JOIN categories c ON ep.category_id = c.category_id
         JOIN subcategories sc ON ep.subcategory_id = sc.subcategory_id
         WHERE ep.post_id = ?`,
        [postId]
    );
    return rows[0];
};

// Get equipment posts by subcategory ID
export const getEquipmentPostsBySubcategoryId = async (subcategoryId) => {
    const [rows] = await pool.execute(
        `SELECT ep.*, c.name AS category_name, sc.name AS subcategory_name
         FROM equipment_post ep
                  JOIN categories c ON ep.category_id = c.category_id
                  JOIN subcategories sc ON ep.subcategory_id = sc.subcategory_id
         WHERE ep.subcategory_id = ?
         ORDER BY ep.created_at DESC`,
        [subcategoryId]
    );
    return rows;
};


// CREATE
export const createEquipmentPost = async (data) => {
    const {
        title,
        contact,
        price,
        description,
        brand,
        model,
        usage,
        item_condition,
        address_line1,
        address_line2,
        country,
        city,
        category_id,
        subcategory_id,
        location,
        photos,
    } = data;

    const post_id = uuidv4().replace(/-/g, "").substring(0, 20); // max 20 chars

    const [result] = await pool.execute(
        `INSERT INTO equipment_post
         (post_id, title, contact, price, description, brand, model, \`usage\`, item_condition,
          address_line1, address_line2, country, city, category_id, subcategory_id, location, photos)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            post_id,
            title,
            contact,
            price || null,
            description || null,
            brand || null,
            model || null,
            usage || null,
            item_condition || null,
            address_line1 || null,
            address_line2 || null,
            country || null,
            city || null,
            category_id,
            subcategory_id,
            location || null,
            photos || null,
        ]
    );

    return { post_id, ...data };
};

// Update existing equipment post
export const updateEquipmentPost = async (postId, fields) => {
    const setParts = [];
    const values = [];

    for (const [key, val] of Object.entries(fields)) {
        setParts.push(`\`${key}\` = ?`);
        values.push(key === "photos" ? JSON.stringify(val) : val);
    }

    values.push(postId);

    const [result] = await pool.execute(
        `UPDATE equipment_post SET ${setParts.join(", ")} WHERE post_id = ?`,
        values
    );

    return result.affectedRows > 0;
};

// Delete equipment post
export const deleteEquipmentPost = async (postId) => {
    const [result] = await pool.execute(
        "DELETE FROM equipment_post WHERE post_id = ?",
        [postId]
    );
    return result.affectedRows > 0;
};
