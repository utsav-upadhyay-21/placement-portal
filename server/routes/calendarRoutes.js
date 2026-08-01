const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
} = require("../controllers/calendarController");

router.get("/", getAllEvents);

router.get("/:id", getEventById);

router.post("/", verifyToken, createEvent);

router.put("/:id", verifyToken, updateEvent);

router.delete("/:id", verifyToken, deleteEvent);

module.exports = router;