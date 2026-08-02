const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const adminAuth = require("../middleware/adminAuth");

const {
    getAllMaterials,
    createMaterial,
    updateMaterial,
    deleteMaterial
} = require("../controllers/materialController");

router.get("/", verifyToken, getAllMaterials);

router.post("/", adminAuth, createMaterial);

router.put("/:id", adminAuth, updateMaterial);

router.delete("/:id", adminAuth, deleteMaterial);

module.exports = router;
