import { pool } from "../db.js";

export const RegistrationOtpModel = {
    async deleteByEmail(email) {
        const query = `DELETE FROM registration_otps WHERE email = ?`;
        await pool.execute(query, [email]);
    },

    async saveOtps({
                       email,
                       email_otp,
                       email_otp_expires,
                       mobile_otp,
                       mobile_otp_expires
                   }) {
        const query = `
            INSERT INTO registration_otps
                (email, email_otp, email_otp_expires, mobile_otp, mobile_otp_expires)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                                 email_otp = VALUES(email_otp),
                                 email_otp_expires = VALUES(email_otp_expires),
                                 mobile_otp = VALUES(mobile_otp),
                                 mobile_otp_expires = VALUES(mobile_otp_expires),
                                 created_at = CURRENT_TIMESTAMP;
        `;

        await pool.execute(query, [
            email,
            email_otp,
            email_otp_expires,
            mobile_otp,
            mobile_otp_expires
        ]);
    },


    async findByEmail(email) {
        const query = `SELECT * FROM registration_otps WHERE email = ? LIMIT 1`;
        const [rows] = await pool.execute(query, [email]);
        return rows.length ? rows[0] : null;
    },

    async remove(email) {
        const query = `DELETE FROM registration_otps WHERE email = ?`;
        await pool.execute(query, [email]);
    }
};
