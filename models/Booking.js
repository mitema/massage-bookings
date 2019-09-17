const mongoose = require("mongoose");

const BookingSchema = mongoose.Schema({
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model("bookings", BookingSchema);
