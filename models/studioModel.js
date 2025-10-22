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

export const createStudio = async (studioData) => {

    const query = `
        INSERT INTO studio (
            title, category_title, sub_category_title, contact, price, description,
            country, city, location, category_id, subcategory_id, photos, sale_price, rating, is_rent
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        studioData.title || null,
        studioData.category_title || 'Studios',
        studioData.sub_category_title || null,
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
        studioData.is_rent ? 1 : 0
    ];

    const [result] = await pool.execute(query, params);

    // MySQL insertId is the auto-generated id
    return { insertedId: result.insertId };};
