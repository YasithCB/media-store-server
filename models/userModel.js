import {pool} from "../db.js";
import bcrypt from "bcrypt";

export const UserModel = {
    async create(user) {
        const { name, email, password, phone, profile_picture } = user;

        // Generate a unique user ID based on timestamp + random number
        const timestamp = Date.now(); // current timestamp in ms
        const randomStr = Math.floor(Math.random() * 1e6); // random 6-digit number
        const id = `user_${timestamp}${randomStr}`;

        const [result] = await pool.execute(
            `INSERT INTO user (id, name, email, password, phone, profile_picture) VALUES (?, ?, ?, ?, ?, ?)`,
            [id, name, email, password, phone, profile_picture]
        );

        return { id, ...user };
    },

    async findByEmailUser(email) {
        const [rows] = await pool.execute(
            `SELECT * FROM user WHERE email = ?`,
            [email]
        );
        return rows[0];
    },
    async findByEmailDealer(email) {
        const [rows] = await pool.execute(
            `SELECT * FROM dealer WHERE email = ?`,
            [email]
        );
        return rows[0];
    },

    async findById(user_id) {
        const [rows] = await pool.execute(
            `SELECT id, name, email, phone, profile_picture, created_at, updated_at
             FROM user WHERE id = ?`,
            [user_id]
        );
        return rows[0];
    },

    async update(user_id, data) {
        if (!data || Object.keys(data).length === 0) return 0; // nothing to update

        // Build query dynamically
        const fields = Object.keys(data)
            .map((key) => `${key} = ?`)
            .join(", ");
        const values = Object.values(data);

        const [result] = await pool.execute(
            `UPDATE user SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [...values, user_id]
        );

        return result.affectedRows;
    },


    // PW RESET -----------------------------------------------

    // Save reset code and expiry time
    async saveResetCode(email, code, role) {
        const tables = {
            user: "user",
            dealer: "dealer",
        };

        const table = tables[role];
        if (!table) throw new Error("Invalid role");

        await pool.execute(
            `UPDATE ${table} 
             SET reset_code = ?, reset_expires = DATE_ADD(NOW(), INTERVAL 15 MINUTE) 
             WHERE email = ?`,
            [code, email]
        );
    },

    // Verify if reset code is valid
    async verifyResetCode(email, code, role) {
        const tables = {
            user: "user",
            dealer: "dealer",
        };

        const table = tables[role];
        if (!table) throw new Error("Invalid role");

        const [rows] = await pool.execute(
            `SELECT * FROM ${table} WHERE email = ? AND reset_code = ? AND reset_expires > NOW()`,
            [email, code]
        );

        return rows[0] || null;
    },


    // Update password after verifying code
    async updatePassword(email, newPassword, role) {
        const tables = {
            user: "user",
            dealer: "dealer",
        };

        const table = tables[role];
        if (!table) throw new Error("Invalid role");

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.execute(
            `UPDATE ${table} 
               SET password = ?, reset_code = NULL, reset_expires = NULL 
               WHERE email = ?`,
                    [hashedPassword, email]
                );
    },


};
