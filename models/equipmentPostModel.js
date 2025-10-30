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

// Get the best equipment post by subcategory ID
export const getBestEquipmentBySubcategoryId = async (subcategoryId) => {
    const [rows] = await pool.execute(
        `SELECT ep.*
         FROM equipment_post ep
         WHERE ep.subcategory_id = ?
         ORDER BY ep.rating DESC`,
        [subcategoryId]
    );
    return rows[0];
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
            id, user_id, title, category_title, sub_category_title, contact, email, price, sale_price, description,
            brand, model, \`usage\`, item_condition, address_line1, address_line2, country, city, location,
            category_id, subcategory_id, photos, is_rent, is_used
        ) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        postId,
        postData.user_id,
        postData.title || null,
        postData.category_title || null,
        postData.sub_category_title || null,
        postData.contact || null,
        postData.email || null,
        postData.price || null,
        postData.sale_price || null,
        postData.description || null,
        postData.brand || null,
        postData.model || null,
        postData.usage || null,
        postData.item_condition || null,
        postData.address_line1 || null,
        postData.address_line2 || null,
        postData.country || null,
        postData.city || null,
        postData.location || null,
        postData.category_id || null,
        postData.subcategory_id || null,
        JSON.stringify(postData.photos || []),
        postData.is_rent ? 1 : 0,
        postData.is_used ? 1 : 0
    ];

    const [result] = await pool.execute(query, params);
    return { id: postId, insertedId: result.insertId };
};


// UPDATE existing equipment post (only details, auto-update updated_at)
export const updateEquipmentPost = async (postId, fields) => {
    if (!fields || Object.keys(fields).length === 0) return false;

    console.log('updateEquipmentPost --> fields');
    console.log(fields);

    // Allowed columns to update (exclude id and created_at)
    const allowedFields = [
        "title", "category_title", "sub_category_title", "contact", "email", "price", "sale_price",
        "description", "brand", "model", "usage", "item_condition", "address_line1", "address_line2",
        "country", "city", "location", "category_id", "subcategory_id", "photos",
        "is_rent", "is_used", "rating"
    ];

    const setParts = [];
    const values = [];

    for (const [key, val] of Object.entries(fields)) {
        if (!allowedFields.includes(key)) continue; // skip unknown or forbidden fields

        const value = val === undefined ? null : (key === "photos" ? JSON.stringify(val) : val);
        setParts.push(`\`${key}\` = ?`);
        values.push(value);
    }

    // If nothing to update, return false
    if (setParts.length === 0) return false;

    // Auto-update updated_at
    setParts.push("updated_at = NOW()");

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
