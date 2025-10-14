import { pool } from "../db.js";

export const getAllPosts = async () => {
    const [rows] = await pool.execute(`
        SELECT
            id AS id,
            'dealer' AS type,
            logo AS logo,
            JSON_UNQUOTE(JSON_EXTRACT(photos, '$[0]')) AS image,
            name AS title,
            description,
            services_starting_from AS price,
            NULL AS salary
        FROM dealer_post

        UNION ALL

        SELECT
            id AS id,
            'equipment' AS type,
            NULL AS logo,
            JSON_UNQUOTE(JSON_EXTRACT(photos, '$[0]')) AS image,
            title,
            description,
            price,
            NULL AS salary
        FROM equipment_post

        UNION ALL

        SELECT
            id AS id,
            'job' AS type,
            logo AS logo,
            NULL AS image,
            title,
            description,
            NULL AS price,
            salary
        FROM job_post

        ORDER BY id DESC
    `);

    return rows;
};


export const getPostsByRating = async (minRating) => {
    const [rows] = await pool.query(
        "SELECT * FROM posts WHERE rating > ? ORDER BY rating DESC",
        [minRating]
    );
    return rows;
};

export const getPostsByCategoryId = async (categoryId) => {
    const [rows] = await pool.query(
        `SELECT p.*, u.name AS user_name, sc.name AS subcategory_name, c.name AS category_name
         FROM posts p
                  JOIN user u ON p.user_id = u.user_id
                  JOIN subcategories sc ON p.subcategory_id = sc.id
                  JOIN categories c ON p.category_id = c.id
         WHERE p.category_id = ?`,
        [categoryId]
    );
    return rows;
};

// Get posts by subcategory
export const getPostsBySubcategoryId = async (subcategoryId) => {
    const [rows] = await pool.query(
        `SELECT p.*,
                u.name AS user_name,
                COALESCE(AVG(r.rating), 0) AS avg_rating,
                COUNT(r.id) AS total_reviews
         FROM posts p
                  JOIN user u ON p.user_id = u.user_id
                  LEFT JOIN reviews r ON p.id = r.id
         WHERE p.subcategory_id = ?
         GROUP BY p.id
         ORDER BY avg_rating DESC, total_reviews DESC`,
        [subcategoryId]
    );
    return rows;
};

// Get post by ID
export const getPostById = async (postId) => {
    // 🟢 1. Check Equipment Post
    let [rows] = await pool.query(
        `SELECT *, 'equipment' AS type FROM equipment_post WHERE id = ? LIMIT 1`,
        [postId]
    );
    if (rows.length > 0) return rows[0];

    // 🟢 2. Check Dealer Post
    [rows] = await pool.query(
        `SELECT *, 'dealer' AS type FROM dealer_post WHERE id = ? LIMIT 1`,
        [postId]
    );
    if (rows.length > 0) return rows[0];

    // 🟢 3. Check Job Post
    [rows] = await pool.query(
        `SELECT *, 'job' AS type FROM job_post WHERE id = ? LIMIT 1`,
        [postId]
    );
    if (rows.length > 0) return rows[0];

    // ❌ If not found anywhere
    return null;
};



// Create post
export const createPost = async ({ user_id, subcategory_id, title, description, price, media }) => {
    const [result] = await pool.query(
        `INSERT INTO posts (user_id, subcategory_id, title, description, price, media, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [user_id, subcategory_id, title, description, price, JSON.stringify(media)]
    );
    return { id: result.insertId };
};

// Update post
export const updatePost = async (postId, { subcategory_id, title, description, price, media }) => {
    const [result] = await pool.query(
        `UPDATE posts
         SET subcategory_id = ?, title = ?, description = ?, price = ?, media = ?, updated_at = NOW()
         WHERE id = ?`,
        [subcategory_id, title, description, price, JSON.stringify(media), postId]
    );
    return result.affectedRows;
};

// Delete post
export const deletePost = async (postId) => {
    const [result] = await pool.query(
        `DELETE FROM posts WHERE id = ?`,
        [postId]
    );
    return result.affectedRows;
};
