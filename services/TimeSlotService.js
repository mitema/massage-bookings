const getBusyDays = require("../api/middlewares/getBusyDays");
const calendarUtils = require("../utils/calenderUtils");
const constants = require("../constants");
const getClientObj = require("../config/connection");
const errorMessages = require("../utils/errorMessages");

const getTimeSlots = async (yearParam, monthParam, dayParam) => {
  const auth = await getClientObj();
  if (!auth) {
    return errorMessages.types.AUTH_FAILURE;
  }

  const fixedStartHour = 9; // 9am
  const fixedEndHour = 18; // 6pm
  const startDate = new Date(
    yearParam,
    monthParam - 1,
    dayParam,
    fixedStartHour
  );
  const endDate = new Date(yearParam, monthParam - 1, dayParam, fixedEndHour);
  let freeSlots = { success: "", timeSlots: [] };
  const check = {
    auth: auth,
    resource: {
      timeMin: startDate,
      timeMax: endDate,
      items: [{ id: "primary" }]
    }
  };
  const busyDays = await getBusyDays(check);
  if (Object.keys(busyDays).length !== 0 && busyDays.constructor === Object) {
    for (day in busyDays) {
      if (calendarUtils.isWeekDay(yearParam, monthParam, day)) {
        freeSlots.success = true;
        freeSlots.timeSlots = calendarUtils.getAvailableSlots(busyDays[day]);
      } else {
        freeSlots.success = true;
        freeSlots.timeSlots = [];
      }
    }
  } else {
    if (calendarUtils.isWeekDay(yearParam, monthParam, dayParam)) {
      freeSlots.success = true;
      freeSlots.timeSlots = calendarUtils.convertToUTCDates(
        yearParam,
        monthParam,
        dayParam,
        constants.fixedSlots
      );
    } else {
      freeSlots.success = true;
      freeSlots.timeSlots = [];
    }
  }
  return freeSlots;
};

module.exports = {
  getTimeSlots
};
