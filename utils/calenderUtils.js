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
      const busyStartDate = new Date(busySlot.startDate);
      const busyEndDate = new Date(busySlot.endDate);
      tempStartDate = new Date(busySlot.startDate);
      tempEndDate = new Date(busySlot.endDate);
      const busyStartTime = convertToMilliseconds(
        `${busyStartDate.getHours()}:${busyStartDate.getMinutes()}`
      );

      const busyEndTime = convertToMilliseconds(
        `${busyEndDate.getHours()}:${busyEndDate.getMinutes()}`
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
      tempStartDate.setHours(startHourMinutes[0]);
      tempStartDate.setMinutes(startHourMinutes[1]);

      const endHourMinutes = slot.end.split(":");
      tempEndDate.setHours(endHourMinutes[0]);
      tempEndDate.setMinutes(endHourMinutes[1]);
      freeSlots.push({ start: tempStartDate, end: tempEndDate });
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
      start: new Date(
        year,
        month,
        day,
        startHourMinutes[0],
        startHourMinutes[1]
      ),

      end: new Date(year, month, day, endHourMinutes[0], endHourMinutes[1])
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
  const dayInMonth = new Date(year, month - 1, day).getDay();
  return dayInMonth != 0 && dayInMonth != 6;
};

const getDaysInAMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

const isTimeWithin9and5pm = (year, month, day, hour, minute) => {
  const lowerBound = new Date(year, month, day, 9).getTime();
  const upperBound = new Date(year, month, day, 17).getTime();
  const expectedBookingTime = new Date(
    year,
    month,
    day,
    hour,
    minute
  ).getTime();
  return expectedBookingTime >= lowerBound && expectedBookingTime <= upperBound;
};

module.exports = {
  getDaysInAMonth,
  isWeekDay,
  isBooking24HoursAdvance,
  convertToMilliseconds,
  getAvailableSlots,
  convertToUTCDates,
  isBookingInPast,
  isTimeWithin9and5pm
};
