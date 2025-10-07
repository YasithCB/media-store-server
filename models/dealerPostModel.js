import {pool} from "../db.js";
import { v4 as uuidv4 } from "uuid";

export const DealerPostModel = {
    // Get all dealer posts
    async getAll() {
        const [rows] = await pool.execute(
            `SELECT dp.*, c.name AS category_name, sc.name AS subcategory_name
             FROM dealer_post dp
             JOIN categories c ON dp.category_id = c.category_id
             JOIN subcategories sc ON dp.subcategory_id = sc.subcategory_id
             ORDER BY dp.created_at DESC`
        );
        return rows;
    },

    // Get by ID
    async getById(id) {
        const [rows] = await pool.execute(
            `SELECT dp.*, c.name AS category_name, sc.name AS subcategory_name
             FROM dealer_post dp
             JOIN categories c ON dp.category_id = c.category_id
             JOIN subcategories sc ON dp.subcategory_id = sc.subcategory_id
             WHERE dp.dealer_id = ?`,
            [id]
        );
        return rows[0];
    },

    // Get by Subcategory
    async getBySubcategory(subcategoryId) {
        const [rows] = await pool.execute(
            `SELECT dp.*, c.name AS category_name, sc.name AS subcategory_name
             FROM dealer_post dp
             JOIN categories c ON dp.category_id = c.category_id
             JOIN subcategories sc ON dp.subcategory_id = sc.subcategory_id
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
            subcategory_id,
            email,
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
            `INSERT INTO dealer_post
             (dealer_id, name, logo, photos, description, category_id, subcategory_id,
              email, phone, whatsapp, website_url, social_links,
              address_line1, address_line2, city, country, location_map,
              services, services_starting_from, working_hours,
              rating, reviews_count, verified, established_year, featured, tags)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                dealer_id,
                name || null,
                logo || null,
                photos || null,
                description || null,
                category_id || null,
                subcategory_id || null,
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
        const fields = Object.keys(data)
            .map((key) => `${key} = ?`)
            .join(", ");

        const values = Object.values(data);

        const [result] = await pool.execute(
            `UPDATE dealer_post SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE dealer_id = ?`,
            [...values, id]
        );

        return result.affectedRows;
    },

    // Delete dealer post
    async delete(id) {
        const [result] = await pool.execute(
            `DELETE FROM dealer_post WHERE dealer_id = ?`,
            [id]
        );
        return result.affectedRows;
    },
};
