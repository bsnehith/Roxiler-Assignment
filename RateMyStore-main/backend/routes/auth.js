const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const router = express.Router();

// ✅ User Registration
router.post("/register", async (req, res) => {
    const { name, email, password, role, storeName, storeAddress } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if user already exists
        const [existing] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: "Email already registered." });
        }

        // Insert user
        const [userResult] = await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            [name, email, hashedPassword, role]
        );

        // Store creation for store_owner
        if (role === "store_owner") {
            const ownerId = userResult.insertId;
            await pool.query(
                "INSERT INTO stores (store_name, store_address, owner_id) VALUES (?, ?, ?)", // Corrected query
                [storeName, storeAddress, ownerId]
            );
        }

        res.json({ message: "User registered successfully!" });
    } catch (err) {
        console.error("❌ Registration Error:", err);
        res.status(500).json({ error: "Server error during registration." });
    }
});

// ✅ User Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

        if (users.length === 0) {
            return res.status(401).json({ msg: "Invalid email or password." });
        }

        const user = users[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: "Invalid email or password." });
        }

        // ✅ Ensure secret exists
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in .env");
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token, role: user.role });
    } catch (err) {
        console.error("❌ Login Error:", err.message || err);
        res.status(500).json({ error: "Server error during login." });
    }
});

module.exports = router;
