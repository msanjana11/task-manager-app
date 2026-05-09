
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");


const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// 🔥 MIDDLEWARE (ORDER MATTERS)
app.use(cors({
    origin: "https://task-manager-app-3hsl-lrgc3jjf9-msanjana11s-projects.vercel.app",
    credentials: true
}));
app.use(express.json());

// 🔐 ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("Task Manager API Running");
});

// MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});