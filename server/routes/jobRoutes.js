const express = require("express");

const router = express.Router();

const adminAuth = require("../middleware/adminAuth");

const {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob
} = require("../controllers/jobController");

router.get("/", getAllJobs);
router.get("/:id", getJobById);

router.post("/test", adminAuth, (req, res) => {
    res.json({
        message: "Welcome Admin",
        admin: req.user
    });

});
router.post("/", adminAuth, createJob);
router.put("/:id", adminAuth, updateJob);
router.delete("/:id", adminAuth, deleteJob);
module.exports = router;
