const express = require("express");

const router = express.Router();

const studentAuth = require("../middleware/studentAuth");

const {
    login,
    getProfile
} = require("../controllers/authController");

router.post("/login", login);

router.get("/profile", studentAuth, getProfile);

module.exports = router;
