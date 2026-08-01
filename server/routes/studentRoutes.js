const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getAllStudents,
    getStudentByUSN,
    updateStudent
} = require("../controllers/studentController");

router.get("/", getAllStudents);
router.get("/:usn", getStudentByUSN);

router.put("/:usn", verifyToken, updateStudent);

module.exports = router;