const callCreateBooking = require("../api/middlewares/createBookings");
const TimeSlotService = require("../services/TimeSlotService");
const errorMessages = require("../utils/errorMessages");
const getClientObj = require("../config/connection");

const createBooking = async (year, month, day, hour, minute) => {
  const auth = await getClientObj();
  if (!auth) {
    return errorMessages.types.AUTH_FAILURE;
  }
  const bookingDate = new Date(
    Date.UTC(year, month - 1, day, hour, minute)
  ).toISOString();

  const availableTimeSlots = await TimeSlotService.getTimeSlots(
    year,
    month,
    day
  );
  if (availableTimeSlots) {
    const bookingSlot = availableTimeSlots.timeSlots.filter(
      availableTimeSlot => {
        return bookingDate.toString() == availableTimeSlot.startTime.toString();
      }
    );

    if (bookingSlot.length > 0) {
      const eventBooking = {
        start: {
          dateTime: `${bookingSlot[0].startTime}`
        },
        end: {
          dateTime: `${bookingSlot[0].endTime}`
        },
        trasparency: "opaque",
        visibility: "public"
      };
      const booking = await callCreateBooking(eventBooking);
      return booking;
    } else {
      return errorMessages.types.INVALID_TIMESLOT;
    }
  }
};

module.exports = {
  createBooking
};
