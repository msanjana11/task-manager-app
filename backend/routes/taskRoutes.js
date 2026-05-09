const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// middleware
const auth = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) return res.status(401).json({ error: "No token" });

    try {
        const decoded = jwt.verify(token, "secretkey");
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

/* ================= CREATE TASK ================= */
router.post("/", auth, async (req, res) => {
    try {
        const { title, description, status } = req.body;

        const task = await Task.create({
            title,
            description,
            status: status || "pending"
        });

        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ================= GET TASKS ================= */
router.get("/", auth, async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ================= UPDATE TASK ================= */
router.put("/:id", auth, async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ================= DELETE TASK ================= */
router.delete("/:id", auth, async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;