const callCreateBooking = require("../api/middlewares/createBookings");
const TimeSlotService = require("../services/TimeSlotService");
const errorMessages = require("../utils/errorMessages");
const getClientObj = require("../config/connection");

const createBooking = async (year, month, day, hour, minute) => {
  const auth = await getClientObj();
  if (!auth) {
    return errorMessages.types.AUTH_FAILURE;
  }
  const bookingDate = new Date(year, month - 1, day, hour, minute);
  const availableTimeSlots = await TimeSlotService.getTimeSlots(
    year,
    month,
    day
  );

  const bookingSlot = availableTimeSlots.timeSlots.filter(availableTimeSlot => {
    return bookingDate.toTimeString() == availableTimeSlot.start.toTimeString();
  });

  if (bookingSlot.length > 0) {
    const eventBooking = {
      start: {
        dateTime: `${bookingSlot[0].start}`
      },
      end: {
        dateTime: `${bookingSlot[0].end}`
      },
      trasparency: "opaque",
      visibility: "public"
    };
    const booking = await callCreateBooking(eventBooking);
    return booking;
  } else {
    return errorMessages.types.INVALID_TIMESLOT;
  }
};

module.exports = {
  createBooking
};
