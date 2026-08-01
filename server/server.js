const express = require("express");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();

const db = require("./config/db");

const studentRoutes = require("./routes/studentRoutes");
const jobRoutes = require("./routes/jobRoutes");
const calendarRoutes = require("./routes/calendarRoutes");
const adminRoutes=require("./routes/adminRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/students", studentRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/admin",adminRoutes);

app.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT NOW() AS currentTime");

        res.json({
            message: "Placement Portal API Running",
            database: "Connected",
            serverTime: rows[0].currentTime
        });

    } catch (error) {

        res.status(500).json({
            message: "Database Connection Failed",
            error: error.message
        });

    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});