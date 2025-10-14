import { pool } from "../db.js";

// Get all equipment posts
export const getAllEquipmentPosts = async () => {
    const [rows] = await pool.execute(
        `SELECT ep.*, c.name AS category_name, sc.name AS subcategory_name
         FROM equipment_post ep
                  JOIN categories c ON ep.category_id = c.id
                  JOIN subcategories sc ON ep.subcategory_id = sc.id
         ORDER BY ep.created_at DESC`
    );

    return rows;
};

// Get by Name (partial match)
export const getByName = async (name) => {
    const [rows] = await pool.execute(
        `SELECT *
             FROM equipment_post ep
             WHERE ep.title LIKE ?`,
        [`%${name}%`]
    );
    return rows;
}

// Get all used equipment posts
export const getUsed = async () => {
    const [rows] = await pool.execute(
        `SELECT *
         FROM equipment_post ep
         WHERE ep.is_used = 1
         ORDER BY ep.created_at DESC`
    );

    return rows;
};

// Get all brand-new equipment posts
export const getBrandNew = async () => {
    const [rows] = await pool.execute(
        `SELECT *
         FROM equipment_post ep
         WHERE ep.is_used = 0
         ORDER BY ep.created_at DESC`
    );

    return rows;
};

// Get all renting equipment posts
export const getRent = async () => {
    const [rows] = await pool.execute(
        `SELECT *
         FROM equipment_post ep
         WHERE ep.is_rent = 1
         ORDER BY ep.created_at DESC`
    );

    return rows;
};

export const getOnSale = async () => {
    const [rows] = await pool.query(
        "SELECT * FROM equipment_post WHERE sale_price IS NOT NULL AND sale_price > 0 ORDER BY updated_at DESC"
    );
    return rows;
};

export const getTopRated = async (minRating = 4) => {
    const [rows] = await pool.query(
        "SELECT * FROM equipment_post WHERE rating >= ? ORDER BY rating DESC",
        [minRating]
    );
    return rows;
};

// Get single equipment post by ID
export const getEquipmentPostById = async (postId) => {
    const [rows] = await pool.execute(
        `SELECT ep.*, c.name AS category_name, sc.name AS subcategory_name
         FROM equipment_post ep
         JOIN categories c ON ep.category_id = c.id
         JOIN subcategories sc ON ep.subcategory_id = sc.id
         WHERE ep.id = ?`,
        [postId]
    );
    return rows[0];
};

// Get equipment posts by subcategory ID
export const getEquipmentPostsBySubcategoryId = async (subcategoryId) => {
    const [rows] = await pool.execute(
        `SELECT ep.*, c.name AS category_name, sc.name AS subcategory_name
         FROM equipment_post ep
                  JOIN categories c ON ep.category_id = c.id
                  JOIN subcategories sc ON ep.subcategory_id = sc.id
         WHERE ep.subcategory_id = ?
         ORDER BY ep.created_at DESC`,
        [subcategoryId]
    );
    return rows;
};

export const generateEquipmentPostId = async () => {
    const query = `
        SELECT id
        FROM equipment_post
        ORDER BY id DESC
        LIMIT 1
    `;
    const [rows] = await pool.execute(query);

    if (!rows.length) {
        return "EP0001";
    }

    const lastId = rows[0].id; // e.g. "EP0023"
    const numPart = parseInt(lastId.replace("EP", "")) + 1;
    return "EP" + numPart.toString().padStart(4, "0"); // e.g. "EP0024"
};

// CREATE
export const createEquipmentPost = async (postData) => {
    const postId = await generateEquipmentPostId();

    const query = `
        INSERT INTO equipment_post (
            id, title, contact, price, description, brand, model, \`usage\`, item_condition,
            address_line1, address_line2, country, city, location,
            category_id, subcategory_id, photos
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;


    const params = [
        postId,
        postData.title,
        postData.contact,
        postData.price || null,
        postData.description,
        postData.brand || null,
        postData.model || null,
        postData.usage || null,
        postData.item_condition || null,
        postData.address_line1 || null,
        postData.address_line2 || null,
        postData.country || null,
        postData.city || null,
        postData.location || null,
        postData.category_id,
        postData.subcategory_id,
        JSON.stringify(postData.photos || [])
    ];

    const [result] = await pool.execute(query, params);
    return { id: postId, insertedId: result.insertId };
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
        `UPDATE equipment_post SET ${setParts.join(", ")} WHERE id = ?`,
        values
    );

    return result.affectedRows > 0;
};

// Delete equipment post
export const deleteEquipmentPost = async (postId) => {
    const [result] = await pool.execute(
        "DELETE FROM equipment_post WHERE id = ?",
        [postId]
    );
    return result.affectedRows > 0;
};
