const getBusyDays = require("../api/middlewares/getBusyDays");
const calendarUtils = require("../utils/calenderUtils");
const getClientObj = require("../config/connection");
const errorMessages = require("../utils/errorMessages");

module.exports = {
  getDays: async (yearParam, monthParam) => {
    const startDate = new Date(Date.UTC(yearParam, monthParam - 1, 1, 9));
    const endDate = new Date(Date.UTC(yearParam, monthParam, 0, 18));

    const num_days_month = calendarUtils.getDaysInAMonth(yearParam, monthParam);
    const daysResult = { success: "", days: [] };
    const auth = await getClientObj();
    if (!auth) {
      return errorMessages.types.AUTH_FAILURE;
    }
    const check = {
      auth: auth,
      resource: {
        timeMin: startDate,
        timeMax: endDate,
        items: [{ id: "primary" }]
      }
    };

    busyDays = await getBusyDays(check);

    if (Object.keys(busyDays).length !== 0 && busyDays.constructor === Object) {
      for (let i = 1; i <= num_days_month; i++) {
        if (busyDays[i]) {
          if (calendarUtils.isWeekDay(yearParam, monthParam, i)) {
            if (calendarUtils.getAvailableSlots(busyDays[i]).length > 0) {
              daysResult.success = true;
              daysResult.days.push({ day: i, hasTimeSlots: true });
            } else {
              daysResult.success = true;
              daysResult.days.push({ day: i, hasTimeSlots: false });
            }
          } else {
            daysResult.success = true;
            daysResult.days.push({ day: i, hasTimeSlots: false });
          }
        } else {
          if (calendarUtils.isWeekDay(yearParam, monthParam, i)) {
            daysResult.success = true;
            daysResult.days.push({ day: i, hasTimeSlots: true });
          } else {
            daysResult.success = true;
            daysResult.days.push({ day: i, hasTimeSlots: false });
          }
        }
      }
    } else {
      for (let i = 1; i <= num_days_month; i++) {
        if (calendarUtils.isWeekDay(yearParam, monthParam, i)) {
          daysResult.success = true;
          daysResult.days.push({ day: i, hasTimeSlots: true });
        } else {
          daysResult.success = true;
          daysResult.days.push({ day: i, hasTimeSlots: false });
        }
      }
    }
    return daysResult;
  }
};
