import { pool } from "../db.js";

// Get all studios
export const getAllStudios = async () => {
    const [rows] = await pool.execute(
        `SELECT *
         FROM studio
         ORDER BY created_at DESC`
    );

    return rows;
};

export const getBySubcategoryId = async (subcategoryId) => {
    const [rows] = await pool.execute(`
        SELECT *
        FROM studio 
        WHERE subcategory_id = ?
        ORDER BY created_at DESC
    `, [subcategoryId]);
    return rows;
};

export const getById = async (postId) => {
    const [rows] = await pool.execute(
        `SELECT *
         FROM studio
         WHERE id = ?`,
        [postId]
    );
    return rows[0];
};

export const createStudio = async (studioData) => {
    const customId = `stu_${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const query = `
        INSERT INTO studio (
            id, user_id, title, category_title, subcategory_title, contact, price, description,
            country, city, location, category_id, subcategory_id, photos, sale_price, rating, is_rent
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        customId, // ✅ custom ID
        studioData.user_id || null, // ✅ fixed: was userId before
        studioData.title || null,
        studioData.category_title || 'Studios',
        studioData.subcategory_title || null,
        studioData.contact || null,
        studioData.price || null,
        studioData.description || null,
        studioData.country || null,
        studioData.city || null,
        studioData.location || null,
        studioData.category_id || 4,
        studioData.subcategory_id || null,
        JSON.stringify(studioData.photos || []),
        studioData.sale_price || null,
        studioData.rating || 3,
        studioData.is_rent === true || studioData.is_rent === 'true' ? 1 : 0 // ✅ ensures boolean consistency
    ];

    // Ensure no undefined values are left
    const sanitizedParams = params.map(v => v === undefined ? null : v);

    const [result] = await pool.execute(query, sanitizedParams);

    return { insertedId: customId };
};

// UPDATE studio post
export const updateStudioById = async (id, fields) => {
    if (!fields || Object.keys(fields).length === 0) return false;

    const allowedFields = [
        "title",
        "category_title",
        "sub_category_title",
        "contact",
        "price",
        "description",
        "country",
        "city",
        "location",
        "category_id",
        "subcategory_id",
        "photos",
        "sale_price",
        "rating",
        "is_rent",
    ];

    const setParts = [];
    const values = [];

    for (const [key, val] of Object.entries(fields)) {
        if (!allowedFields.includes(key)) continue;

        const value = key === "photos" ? JSON.stringify(val || []) : val ?? null;

        setParts.push(`\`${key}\` = ?`);
        values.push(value);
    }

    // Auto-update timestamp
    setParts.push("updated_at = CURRENT_TIMESTAMP");

    if (setParts.length === 0) return false;

    values.push(id);

    const query = `
      UPDATE studio
      SET ${setParts.join(", ")}
      WHERE id = ?
  `;

    const [result] = await pool.execute(query, values);
    return { affectedRows: result.affectedRows };
};