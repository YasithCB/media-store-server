import { pool } from "../db.js";

// Get all job posts
export const getAllJobPosts = async () => {
    const [rows] = await pool.execute(`
        SELECT jp.*, c.name AS category_name, sc.name AS subcategory_name
        FROM job_post jp
        JOIN categories c ON jp.category_id = c.id
        JOIN subcategories sc ON jp.subcategory_id = sc.id
        ORDER BY jp.posted_date DESC
    `);
    return rows;
};

// Get job posts by subcategory ID
export const getBySubcategoryId = async (subcategoryId) => {
    const [rows] = await pool.execute(`
        SELECT *
        FROM job_post jp
        WHERE jp.subcategory_id = ?
        ORDER BY jp.posted_date DESC
    `, [subcategoryId]);
    return rows;
};

// Get job hirings
export const getHiring = async () => {
    const [rows] = await pool.execute(`
        SELECT *
        FROM job_post jp
        WHERE jp.is_hiring = 1
        ORDER BY jp.posted_date DESC
    `);
    return rows;
};

// Get by Name (partial match)
export const getByName = async (name) => {
    const [rows] = await pool.execute(
        `SELECT *
             FROM job_post jp
             WHERE jp.title LIKE ?`,
        [`%${name}%`]
    );
    return rows;
}

// Get single job post by ID
export const getJobPostById = async (postId) => {
    const [rows] = await pool.execute(`
        SELECT jp.*, c.name AS category_name, sc.name AS subcategory_name
        FROM job_post jp
        JOIN categories c ON jp.category_id = c.id
        JOIN subcategories sc ON jp.subcategory_id = sc.id
        WHERE jp.id = ?
    `, [postId]);
    return rows[0];
};

export const generateJobPostId = async () => {
    const query = `
        SELECT id
        FROM job_post
        ORDER BY CAST(SUBSTRING(id, 3) AS UNSIGNED) DESC
        LIMIT 1
    `;
    const [rows] = await pool.execute(query);

    if (rows.length === 0) {
        return "JP0001";
    }

    const lastId = rows[0].id; // e.g. "JP0023"
    const numPart = parseInt(lastId.replace("JP", ""), 10) + 1;
    return `JP${numPart.toString().padStart(4, "0")}`; // e.g. "JP0024"
};


// Create job post
export const createJobPost = async (postData) => {
    // Generate custom ID
    postData.id = await generateJobPostId();

    const query = `
        INSERT INTO job_post (
            id,user_id, title, company_name, logo, location, country, job_type, industry,
            experience_level, salary, salary_type, description, posted_date, expiry_date,
            email, phone, application_url, remote, tags, category_id, subcategory_id,
            is_hiring
        ) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        postData.id,
        postData.user_id,
        postData.title ?? null,
        postData.company_name ?? null,
        postData.logo ?? null,
        postData.location ?? null,
        postData.country ?? null,
        postData.job_type ?? null,
        postData.industry ?? null,
        postData.experience_level ?? null,
        postData.salary ?? null,
        postData.salary_type ?? null,
        postData.description ?? null,
        postData.posted_date ?? new Date(),
        postData.expiry_date ?? null,
        postData.email ?? null,
        postData.phone ?? null,
        postData.application_url ?? null,
        postData.remote != null ? postData.remote : 0,
        JSON.stringify(postData.tags || []),
        postData.category_id ?? null,
        postData.subcategory_id ?? null,
        postData.is_hiring != null ? postData.is_hiring : 1
    ];

    const [result] = await pool.execute(query, params);
    return result;
};


// UPDATE existing job post
export const updateJobPost = async (postId, fields) => {
    if (!fields || Object.keys(fields).length === 0) return false;

    // ✅ Allowed columns (don't include id or created_at)
    const allowedFields = [
        "title", "company_name", "logo", "location", "country", "job_type", "industry",
        "experience_level", "salary", "salary_type", "description",
        "expiry_date", "email", "phone", "application_url", "remote", "tags",
        "category_id", "subcategory_id", "is_hiring"
    ];

    const setParts = [];
    const values = [];

    for (const [key, val] of Object.entries(fields)) {
        if (!allowedFields.includes(key)) continue; // skip unrecognized fields

        let value = val;
        if (value === undefined) value = null;

        // Handle JSON fields
        if (key === "tags") value = JSON.stringify(value || []);

        setParts.push(`\`${key}\` = ?`);
        values.push(value);
    }

    // ✅ Add automatic timestamp update
    setParts.push("updated_at = CURRENT_TIMESTAMP");

    // If there’s nothing to update, stop
    if (setParts.length === 0) return false;

    values.push(postId);

    const [result] = await pool.execute(
        `UPDATE job_post SET ${setParts.join(", ")} WHERE id = ?`,
        values
    );

    return result.affectedRows > 0;
};


// Delete job post
export const deleteJobPost = async (postId) => {
    const [result] = await pool.execute(`
        DELETE FROM job_post WHERE id = ?
    `, [postId]);
    return result;
};
