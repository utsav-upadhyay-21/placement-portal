const express = require("express");
const router = express.Router();

const adminAuth = require("../middleware/adminAuth");

const {
    getAllStudents,
    getStudentByUSN,
    updateStudent
} = require("../controllers/studentController");

router.get("/", adminAuth, getAllStudents);
router.get("/:usn", adminAuth, getStudentByUSN);

router.put("/:usn", adminAuth, updateStudent);

module.exports = router;
