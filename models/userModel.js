import {pool} from "../db.js";

export const UserModel = {
    async create(user) {
        const { name, email, password, phone, profile_picture } = user;
        const [result] = await pool.execute(
            `INSERT INTO user (name, email, password, phone, profile_picture) VALUES (?, ?, ?, ?, ?)`,
            [name, email, password, phone, profile_picture]
        );
        return { user_id: result.insertId, ...user };
    },

    async findByEmail(email) {
        const [rows] = await pool.execute(
            `SELECT * FROM user WHERE email = ?`,
            [email]
        );
        return rows[0];
    },

    async findById(user_id) {
        const [rows] = await pool.execute(
            `SELECT user_id, name, email, phone, profile_picture, created_at, updated_at
             FROM user WHERE user_id = ?`,
            [user_id]
        );
        return rows[0];
    },

    async update(user_id, data) {
        const fields = Object.keys(data)
            .map((key) => `${key} = ?`)
            .join(", ");
        const values = Object.values(data);

        const [result] = await pool.execute(
            `UPDATE user SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
            [...values, user_id]
        );
        return result.affectedRows;
    },

    // reset password related
    async saveResetOTP(userId, otp) {
        const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
        await pool.execute(
            "UPDATE user SET reset_otp = ?, otp_expires_at = ? WHERE user_id = ?",
            [otp, expires, userId]
        );
    },


    async verifyResetOTP(userId, otp) {
        const [rows] = await pool.execute(
            "SELECT * FROM user WHERE user_id = ? AND reset_otp = ? AND otp_expires_at > NOW()",
            [userId, otp]
        );
        console.log(rows)
        return rows.length > 0;
    },

    async saveResetToken(userId, token) {
        await pool.execute(
            "UPDATE user SET reset_token = ?, reset_otp = NULL, otp_expires_at = NULL WHERE user_id = ?",
            [token, userId]
        );
    },

    async findByResetToken(token) {
        const [rows] = await pool.execute(
            "SELECT * FROM user WHERE reset_token = ?",
            [token]
        );
        return rows[0];
    },

    async updatePassword(userId, hashedPassword) {
        await pool.execute(
            "UPDATE user SET password = ?, reset_token = NULL WHERE user_id = ?",
            [hashedPassword, userId]
        );
    }


};
