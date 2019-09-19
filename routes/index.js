const express = require("express");
const router = express.Router();
const bookings = require("./bookings/bookings");

router.get("/days", bookings.listAvailableDays);
router.get("/timeslots", bookings.getAvailableSlots);
router.post("/book", bookings.createBooking);
module.exports = router;
