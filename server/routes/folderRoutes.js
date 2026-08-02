const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const adminAuth = require("../middleware/adminAuth");

const {
    getAllFolders,
    createFolder,
    updateFolder,
    deleteFolder
} = require("../controllers/folderController");

router.get("/", verifyToken, getAllFolders);

router.post("/", adminAuth, createFolder);

router.put("/:id", adminAuth, updateFolder);

router.delete("/:id", adminAuth, deleteFolder);

module.exports = router;
