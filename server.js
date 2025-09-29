import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed:", err);
        return;
    }
    console.log("✅ Connected to MySQL");
});

// Routes
app.get("/", (req, res) => {
    res.send("Hello from Node + MySQL 🚀");
});

// Example: Fetch users
app.get("/users", (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Start server
app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on port ${process.env.PORT}`);
});
