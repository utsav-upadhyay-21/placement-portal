const express = require("express");

const router = express.Router();

const { login } = require("../controllers/adminController");

console.log("login =", login);

router.post("/login", login);

module.exports = router;