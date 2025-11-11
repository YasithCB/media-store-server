import {pool} from "../db.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

export const DealerPostModel = {
    // Get all dealer posts
    async getAll() {
        const [rows] = await pool.execute(
            `SELECT dp.*, c.name AS category_name, sc.name AS subcategory_name
             FROM dealer dp
             JOIN categories c ON dp.category_id = c.id
             JOIN subcategories sc ON dp.subcategory_id = sc.id
             ORDER BY dp.created_at DESC`
        );
        return rows;
    },

    async getTopRated (minRating = 4)  {
        const [rows] = await pool.query(
            "SELECT * FROM dealer WHERE rating >= ? ORDER BY rating DESC",
            [minRating]
        );
        return rows;
    },

    // Get by ID
    async getById(id) {
        const [rows] = await pool.execute(
            `SELECT dp.*, c.name AS category_name, sc.name AS subcategory_name
             FROM dealer dp
             JOIN categories c ON dp.category_id = c.id
             JOIN subcategories sc ON dp.subcategory_id = sc.id
             WHERE dp.id = ?`,
            [id]
        );
        return rows[0];
    },

    // Get by Name (partial match)
    async getByName(name) {
        const [rows] = await pool.execute(
            `SELECT *
             FROM dealer dp
             WHERE dp.title LIKE ?`,
            [`%${name}%`]
        );
        return rows;
    },

    // Get by Subcategory
    async getBySubcategory(subcategoryId) {
        const [rows] = await pool.execute(
            `SELECT dp.*, c.name AS category_name, sc.name AS subcategory_name
             FROM dealer dp
             JOIN categories c ON dp.category_id = c.id
             JOIN subcategories sc ON dp.subcategory_id = sc.id
             WHERE dp.subcategory_id = ?
             ORDER BY dp.created_at DESC`,
            [subcategoryId]
        );
        return rows;
    },


    async create(data) {
        console.log("=== DealerPostModel.create data ===", data);

        const {
            name,
            logo,
            photos,
            description,
            category_id,
            category_title,        // ✅ new
            subcategory_id,
            subcategory_title,     // ✅ new
            email,
            password,
            phone,
            whatsapp,
            website_url,
            social_links,
            address_line1,
            address_line2,
            city,
            country,
            location_map,
            services,
            services_starting_from,
            working_hours,
            rating,
            reviews_count,
            verified,
            established_year,
            featured,
            tags
        } = data;

        // Generate dealer_id (20 chars)
        const dealer_id = uuidv4().replace(/-/g, "").substring(0, 20);

        console.log("=== Generated dealer_id ===", dealer_id);

        const [result] = await pool.execute(
            `INSERT INTO dealer
             (id, password, title, logo, photos, description, category_id, category_title,
              subcategory_id, subcategory_title, email, phone, whatsapp, website_url, social_links,
              address_line1, address_line2, city, country, location_map,
              services, services_starting_from, working_hours,
              rating, reviews_count, verified, established_year, featured, tags)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                dealer_id,
                password || null,
                name || null,
                logo || null,
                photos || null,
                description || null,
                category_id || null,
                category_title || "Top Dealers", // ✅ fallback default
                subcategory_id || null,
                subcategory_title || "Other",    // ✅ fallback default
                email || null,
                phone || null,
                whatsapp || null,
                website_url || null,
                social_links || null,
                address_line1 || null,
                address_line2 || null,
                city || null,
                country || null,
                location_map || null,
                services || null,
                services_starting_from || null,
                working_hours || null,
                rating ?? 0,
                reviews_count ?? 0,
                verified ?? 0,
                established_year || null,
                featured ?? 0,
                tags || null
            ]
        );

        console.log("=== Dealer post created result ===", result);

        return { dealer_id, insertedId: result.insertId, ...data };
    },

    // Update dealer post
    async update(id, data) {
        const updates = [];
        const values = [];

        for (const [key, value] of Object.entries(data)) {
            // Skip password and created_at
            if (key === "password" || key === "created_at" || key === "updated_at") continue;

            // Skip undefined/null values
            if (value === undefined || value === null) continue;

            // Add to update
            updates.push(`${key} = ?`);
            values.push(value);
        }

        if (updates.length === 0) return 0; // nothing to update

        // updated_at will be set automatically by MySQL
        const [result] = await pool.execute(
            `UPDATE dealer SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [...values, id]
        );

        return result.affectedRows;
    },

    // Delete dealer post
    async delete(id) {
        const [result] = await pool.execute(
            `DELETE FROM dealer WHERE id = ?`,
            [id]
        );
        return result.affectedRows;
    },
};
