const express = require("express");

const router = express.Router();

const adminAuth = require("../middleware/adminAuth");

const { cache } = require("../middleware/cacheMiddleware");

const {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
} = require("../controllers/calendarController");

const CALENDAR_TTL = parseInt(process.env.REDIS_CALENDAR_TTL, 10) || 1800;

router.get("/", cache("calendar:events", CALENDAR_TTL), getAllEvents);

router.get("/:id", getEventById);

router.post("/", adminAuth, createEvent);

router.put("/:id", adminAuth, updateEvent);

router.delete("/:id", adminAuth, deleteEvent);

module.exports = router;
