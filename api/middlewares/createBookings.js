const { google } = require("googleapis");
const getClientObj = require("../../config/connection");
const errorMessages = require("../../utils/errorMessages");

const createBookings = eventBooking => {
  return new Promise(async (res, reject) => {
    const auth = await getClientObj();
    if (!auth) {
      return errorMessages.types.AUTH_FAILURE;
    }
    const calendar = google.calendar({ version: "v3", auth });
    calendar.events.insert(
      {
        auth: auth,
        calendarId: "primary",
        resource: eventBooking
      },
      function(err, booking) {
        if (err) {
          console.log(
            "There was an error contacting the Calendar service: " + err
          );
          return;
        }
        const result = {
          success: true,
          startTime: new Date(booking.data.start.dateTime).toISOString(),
          endTime: new Date(booking.data.end.dateTime).toISOString()
        };
        res(result);
      }
    );
  }).catch(err => {
    console.log("Error creating bookings");
  });
};
module.exports = createBookings;
