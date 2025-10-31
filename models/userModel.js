import {pool} from "../db.js";

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


    async findByEmail(email) {
        const [rows] = await pool.execute(
            `SELECT * FROM user WHERE email = ?`,
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

    // reset password related
    async saveResetOTP(userId, otp) {
        const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
        await pool.execute(
            "UPDATE user SET reset_otp = ?, otp_expires_at = ? WHERE id = ?",
            [otp, expires, userId]
        );
    },


    async verifyResetOTP(userId, otp) {
        const [rows] = await pool.execute(
            "SELECT * FROM user WHERE id = ? AND reset_otp = ? AND otp_expires_at > NOW()",
            [userId, otp]
        );
        console.log(rows)
        return rows.length > 0;
    },

    async saveResetToken(userId, token) {
        await pool.execute(
            "UPDATE user SET reset_token = ?, reset_otp = NULL, otp_expires_at = NULL WHERE id = ?",
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
            "UPDATE user SET password = ?, reset_token = NULL WHERE id = ?",
            [hashedPassword, userId]
        );
    }


};
