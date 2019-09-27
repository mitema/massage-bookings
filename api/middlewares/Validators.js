const errorMessages = require("../../utils/errorMessages");
const calendarUtils = require(".././../utils/calenderUtils");
module.exports = {
  validateQueryParams(
    params,
    checkExtraTimeSlotParams,
    checkExtraBookingsParams
  ) {
    if (params) {
      if (params.year == null) {
        return errorMessages.types.MISSING_YEAR;
      }

      if (isNaN(Number(params.year)) || params.year === "") {
        return errorMessages.types.INVALID_YEAR;
      }
      if (params.year.toString().length != "4") {
        return errorMessages.types.INVALID_YEAR;
      }
      if (params.month == null) {
        return errorMessages.types.MISSING_MONTH;
      }
      if (
        isNaN(Number(params.month)) ||
        params.month < 1 ||
        params.month > 12 ||
        params.month === ""
      ) {
        return errorMessages.types.INVALID_MONTH;
      }
      if (checkExtraTimeSlotParams) {
        if (params.day == null) {
          return errorMessages.types.MISSING_DAY;
        }

        if (
          isNaN(Number(params.day)) ||
          params.day < 1 ||
          params.day > 31 ||
          params.day === ""
        ) {
          return errorMessages.types.INVALID_DAY;
        }
      }
      if (checkExtraBookingsParams) {
        if (params.hour == null) {
          return errorMessages.types.MISSING_HOUR;
        }

        if (
          isNaN(Number(params.hour)) ||
          params.hour < 0 ||
          params.hour > 23 ||
          params.hour === ""
        ) {
          return errorMessages.types.INVALID_HOUR;
        }
        if (params.minute == null) {
          return errorMessages.types.MISSING_MINUTES;
        }

        if (
          isNaN(Number(params.minute)) ||
          params.minute < 0 ||
          params.minute > 60 ||
          params.minute === ""
        ) {
          return errorMessages.types.INVALID_MINUTES;
        }
        const date = new Date(
          Date.UTC(
            params.year,
            params.month - 1,
            params.day,
            params.hour,
            params.minute
          )
        );

        if (calendarUtils.isBookingInPast(date)) {
          return errorMessages.types.INVALID_BOOK_TIME;
        }
        if (!calendarUtils.isBooking24HoursAdvance(date)) {
          return errorMessages.types.INVALID_BOOKING_DATE;
        }
        if (
          !calendarUtils.isWeekDay(params.year, params.month, params.day) ||
          !calendarUtils.isTimeWithin9and5pm(
            params.year,
            params.month,
            params.day,
            params.hour,
            params.minute
          )
        ) {
          return errorMessages.types.INVALID_BOOK_DAY;
        }
      }
    }
    return errorMessages.types.VALID_PARAMETERS;
  }
};
