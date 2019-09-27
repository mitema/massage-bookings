const constants = require("../constants");

const getAvailableSlots = busySlots => {
  const freeSlots = [];
  overlap = false;
  let tempStartDate = null;
  let tempEndDate = null;
  const fixedSlots = constants.fixedSlots;
  fixedSlots.forEach((slot, index) => {
    const slotStartTime = convertToMilliseconds(slot.start);
    const slotEndTime = convertToMilliseconds(slot.end);

    for (busySlot of busySlots) {
      const busyStartDate = busySlot.startDate;
      const busyEndDate = busySlot.endDate;
      const busyStartDateUTC = parseUTCDate(busyStartDate);
      const busyStartDateUTCHour = busyStartDateUTC[3];
      const busyStartDateUTCMinute = busyStartDateUTC[3];

      const busyStartTime = convertToMilliseconds(
        `${busyStartDateUTCHour}:${busyStartDateUTCMinute}`
      );

      const busyEndDateUTC = parseUTCDate(busyEndDate);
      const busyEndDateUTCHour = busyEndDateUTC[3];
      const busyEndDateUTCMinute = busyEndDateUTC[3];
      const busyEndTime = convertToMilliseconds(
        `${busyEndDateUTCHour}:${busyEndDateUTCMinute}`
      );

      if (slotStartTime <= busyEndTime && slotEndTime >= busyStartTime) {
        overlap = true;
        break;
      } else {
        overlap = false;
      }
    }
    if (!overlap) {
      const startHourMinutes = slot.start.split(":");
      const startUTCDateFormat = parseUTCDate(busySlot.startDate);
      const startYear = startUTCDateFormat[0];
      const startMonth = startUTCDateFormat[1];
      const startDay = startUTCDateFormat[2];
      const startHour = startHourMinutes[0];
      const startMinute = startHourMinutes[1];
      const startSeconds = startUTCDateFormat[5];
      const startMilliseconds = startUTCDateFormat[6];

      tempStartDate = new Date(
        Date.UTC(
          startYear,
          startMonth - 1,
          startDay,
          startHour,
          startMinute,
          startSeconds,
          startMilliseconds
        )
      ).toISOString();

      const endHourMinutes = slot.end.split(":");
      const endUTCDateFormat = parseUTCDate(busySlot.endDate);
      const endYear = endUTCDateFormat[0];
      const endMonth = endUTCDateFormat[1];
      const endDay = endUTCDateFormat[2];
      const endHour = endHourMinutes[0];
      const endMinute = endHourMinutes[1];
      const endSeconds = endUTCDateFormat[5];
      const endMilliseconds = endUTCDateFormat[6];
      tempEndDate = new Date(
        Date.UTC(
          endYear,
          endMonth - 1,
          endDay,
          endHour,
          endMinute,
          endSeconds,
          endMilliseconds
        )
      ).toISOString();
      freeSlots.push({ startTime: tempStartDate, endTime: tempEndDate });
    }
  });
  return freeSlots;
};

const convertToUTCDates = (year, month, day, fixedSlots) => {
  const utcDateFormats = [];
  fixedSlots.forEach(item => {
    const startHourMinutes = item.start.split(":");
    const endHourMinutes = item.end.split(":");

    utcDateFormats.push({
      startTime: new Date(
        Date.UTC(year, month - 1, day, startHourMinutes[0], startHourMinutes[1])
      ).toISOString(),

      endTime: new Date(
        Date.UTC(year, month - 1, day, endHourMinutes[0], endHourMinutes[1])
      ).toISOString()
    });
  });

  return utcDateFormats;
};
const convertToMilliseconds = string => {
  const times = string.split(":");
  const timeMilleSeconds =
    1000 * (Number(times[0] * 60 * 60) + Number(times[1] * 60));
  return timeMilleSeconds;
};

const isBooking24HoursAdvance = date => {
  const currentTime = Date.now();
  const oneDay = 60 * 60 * 24 * 1000;
  const expectedBookingTime = date.getTime();
  return expectedBookingTime - currentTime >= oneDay;
};

const isBookingInPast = date => {
  return date.getTime() < Date.now();
};

const isWeekDay = (year, month, day) => {
  const dayInMonth = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return dayInMonth != 0 && dayInMonth != 6;
};

const getDaysInAMonth = (year, month) => {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
};

const isTimeWithin9and6pm = (year, month, day, hour, minute) => {
  const lowerBound = Date.UTC(year, month, day, 9);
  const upperBound = Date.UTC(year, month, day, 18);
  const expectedBookingTime = Date.UTC(year, month, day, hour, minute);

  return expectedBookingTime >= lowerBound && expectedBookingTime <= upperBound;
};

const parseUTCDate = utcDateString => {
  const utCDateFormatArray = utcDateString.split(/\D+/);
  return utCDateFormatArray;
};

module.exports = {
  getDaysInAMonth,
  isWeekDay,
  isBooking24HoursAdvance,
  convertToMilliseconds,
  getAvailableSlots,
  convertToUTCDates,
  isBookingInPast,
  isTimeWithin9and6pm,
  parseUTCDate
};
