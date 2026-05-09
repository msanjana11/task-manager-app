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

        await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.json({ message: "User created successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LOGIN (FIXED)
router.post("/login", async (req, res) => {
    try {
        const { email } = req.body;

        const token = jwt.sign(
            { email },
            process.env.JWT_SECRET,
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