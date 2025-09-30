import {pool} from "../db.js";

export const getAllUsers = async () => {
    const [rows] = await pool.query("SELECT user_id, name, email, phone, role, profile_picture, created_at FROM users");
    return rows;
};

export const getUserById = async (id) => {
    const [rows] = await pool.query(
        "SELECT user_id, name, email, phone, role, profile_picture, created_at FROM users WHERE user_id = ?",
        [id]
    );
    return rows[0];
};

export const createUser = async ({ name, email, password, phone, role, profile_picture }) => {
    const [result] = await pool.query(
        "INSERT INTO users (name, email, password, phone, role, profile_picture) VALUES (?, ?, ?, ?, ?, ?)",
        [name, email, password, phone, role, profile_picture]
    );
    return { user_id: result.insertId, name, email, phone, role, profile_picture };
};

export const updateUser = async (id, { name, email, phone, role, profile_picture }) => {
    await pool.query(
        "UPDATE users SET name=?, email=?, phone=?, role=?, profile_picture=?, updated_at=NOW() WHERE user_id=?",
        [name, email, phone, role, profile_picture, id]
    );
    return getUserById(id);
};

export const deleteUser = async (id) => {
    await pool.query("DELETE FROM users WHERE user_id = ?", [id]);
    return { message: "User deleted successfully" };
};
