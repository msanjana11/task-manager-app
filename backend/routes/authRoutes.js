const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// SIGNUP
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.json({ message: "User created successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // ❌ REMOVE DB CHECK COMPLETELY
        // 👉 accept ANY email

        const token = jwt.sign(
            { email },
            "secretkey",
            { expiresIn: "1d" }
        );

        res.json({
            token,
            user: { email }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;