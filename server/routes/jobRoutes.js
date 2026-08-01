const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob
} = require("../controllers/jobController");

router.get("/", getAllJobs);
router.get("/:id", getJobById);

router.post("/test", verifyToken, (req, res) => {
    res.json({
        message: "Welcome Admin",
        admin: req.admin
    });

});
router.post("/", verifyToken, createJob);
router.put("/:id", verifyToken, updateJob);
router.delete("/:id", verifyToken, deleteJob);
module.exports = router;