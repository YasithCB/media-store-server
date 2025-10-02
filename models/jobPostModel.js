import { pool } from "../db.js";

// Get all job posts
export const getAllJobPosts = async () => {
    const [rows] = await pool.execute(`
        SELECT jp.*, c.name AS category_name, sc.name AS subcategory_name
        FROM job_post jp
        JOIN categories c ON jp.category_id = c.category_id
        JOIN subcategories sc ON jp.subcategory_id = sc.subcategory_id
        ORDER BY jp.posted_date DESC
    `);
    return rows;
};

// Get job posts by subcategory ID
export const getJobPostsBySubcategoryId = async (subcategoryId) => {
    const [rows] = await pool.execute(`
        SELECT jp.*, c.name AS category_name, sc.name AS subcategory_name
        FROM job_post jp
        JOIN categories c ON jp.category_id = c.category_id
        JOIN subcategories sc ON jp.subcategory_id = sc.subcategory_id
        WHERE jp.subcategory_id = ?
        ORDER BY jp.posted_date DESC
    `, [subcategoryId]);
    return rows;
};

// Get single job post by ID
export const getJobPostById = async (postId) => {
    const [rows] = await pool.execute(`
        SELECT jp.*, c.name AS category_name, sc.name AS subcategory_name
        FROM job_post jp
        JOIN categories c ON jp.category_id = c.category_id
        JOIN subcategories sc ON jp.subcategory_id = sc.subcategory_id
        WHERE jp.post_id = ?
    `, [postId]);
    return rows[0];
};

// Create job post
export const createJobPost = async (postData) => {
    const query = `
        INSERT INTO job_post (
            post_id, title, company_name, logo, location, country, job_type, industry,
            experience_level, salary, salary_type, description, posted_date, expiry_date,
            email, phone, application_url, remote, tags, category_id, subcategory_id,
            are_you_hiring
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
        postData.post_id, postData.title, postData.company_name, postData.logo, postData.location,
        postData.country, postData.job_type, postData.industry, postData.experience_level,
        postData.salary, postData.salary_type, postData.description, postData.posted_date,
        postData.expiry_date, postData.email, postData.phone, postData.application_url,
        postData.remote, JSON.stringify(postData.tags), postData.category_id,
        postData.subcategory_id, postData.are_you_hiring
    ];
    const [result] = await pool.execute(query, params);
    return result;
};

// Update job post
export const updateJobPost = async (postId, postData) => {
    const query = `
        UPDATE job_post SET
            title = ?, company_name = ?, logo = ?, location = ?, country = ?, job_type = ?, industry = ?,
            experience_level = ?, salary = ?, salary_type = ?, description = ?, posted_date = ?, expiry_date = ?,
            email = ?, phone = ?, application_url = ?, remote = ?, tags = ?, category_id = ?, subcategory_id = ?,
            are_you_hiring = ?
        WHERE post_id = ?
    `;
    const params = [
        postData.title, postData.company_name, postData.logo, postData.location, postData.country,
        postData.job_type, postData.industry, postData.experience_level, postData.salary, postData.salary_type,
        postData.description, postData.posted_date, postData.expiry_date, postData.email, postData.phone,
        postData.application_url, postData.remote, JSON.stringify(postData.tags), postData.category_id,
        postData.subcategory_id, postData.are_you_hiring, postId
    ];
    const [result] = await pool.execute(query, params);
    return result;
};

// Delete job post
export const deleteJobPost = async (postId) => {
    const [result] = await pool.execute(`
        DELETE FROM job_post WHERE post_id = ?
    `, [postId]);
    return result;
};
