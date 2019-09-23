const getClientObj = require("../../config/connection");
const { google } = require("googleapis");
const errorMessages = require("../../errorMessages");
const fixedSlots = [
  { start: "9:00", end: "9:40" },
  { start: "9:45", end: "10:25" },
  { start: "10:30", end: "11:10" },
  { start: "11:15", end: "11:55" },
  { start: "12:00", end: "12:40" },
  { start: "12:45", end: "13:25" },
  { start: "13:30", end: "14:10" },
  { start: "14:15", end: "15:55" },
  { start: "16:00", end: "16:40" },
  { start: "16:45", end: "17:25" }
];
const GET_REQUEST_PATHS = { timeslots: "/timeslots", days: "/days" };
const PARAMETERS_TYPES = { month: "month", year: "year", day: "day" };

const bookings = {
  listAvailableDays: async (req, res) => {
    try {
      auth = await getClientObj();
      const path = req.path;
      const monthParam = req.query.month;
      const yearParam = req.query.year;
      const dayParam = req.query.day;
      let startDate = null;
      let endDate = null;
      const num_days_month = getDaysInAMonth(yearParam, monthParam);

      let checkDayParams = true;
      if (GET_REQUEST_PATHS.timeslots === path) {
        const validate_parameters_response = checkParameters(
          req.query,
          checkDayParams
        );
        if (validate_parameters_response.success) {
          startDate = new Date(yearParam, monthParam - 1, dayParam);
          endDate = new Date(yearParam, monthParam - 1, dayParam);
        } else {
          res.json(validate_parameters_response);
        }
      } else if (GET_REQUEST_PATHS.days === path) {
        checkDayParams = false;
        const validate_parameters_response = checkParameters(
          req.query,
          checkDayParams
        );
        if (validate_parameters_response.success) {
          startDate = new Date(yearParam, monthParam - 1, 1);
          endDate = new Date(yearParam, monthParam, 0);
        } else {
          res.json(validate_parameters_response);
        }
      }
      startDate.setHours(9);
      endDate.setHours(17);
      console.log(`${startDate}-${endDate}`);

      const check = {
        auth: auth,
        resource: {
          timeMin: startDate,
          timeMax: endDate,
          items: [{ id: "primary" }]
        }
      };
      const calendar = google.calendar({ version: "v3", auth });
      let busySlots = [];

      calendar.freebusy.query(check, (err, result) => {
        if (err) return console.log("The API returned an error: " + err);
        busySlots = result.data.calendars.primary.busy;
        let days = {};
        let freeSlots = {};
        if (busySlots.length > 0) {
          //const filteredSlots = getSlotsBetween9and5(busySlots);
          busySlots.forEach((busySlot, index) => {
            const startDate = new Date(busySlot.start);
            const endDate = new Date(busySlot.end);
            const startDay = startDate.toLocaleDateString().split("/")[1];
            if (days[`${startDay}`]) {
              days[`${startDay}`].push({
                startDate: startDate,
                endDate: endDate
              });
            } else {
              days[`${startDay}`] = [
                {
                  startDate: startDate,
                  endDate: endDate
                }
              ];
            }
          });

          if (GET_REQUEST_PATHS.timeslots === path) {
            for (day in days) {
              if (isWeekDay(yearParam, monthParam, day)) {
                freeSlots[day] = getAvailableSlots(days[day]);
              } else {
                freeSlots[day] = [];
              }
            }
          } else if (GET_REQUEST_PATHS.days === path) {
            for (let i = 1; i <= num_days_month; i++) {
              if (days[i]) {
                if (isWeekDay(yearParam, monthParam, i)) {
                  freeSlots[i] = getAvailableSlots(days[i]);
                } else {
                  freeSlots[i] = [];
                }
              } else {
                if (isWeekDay(yearParam, monthParam, i)) {
                  freeSlots[i] = fixedSlots;
                } else {
                  freeSlots[i] = [];
                }
              }
            }
          }
        } else {
          if (GET_REQUEST_PATHS.timeslots === path) {
            freeSlots[dayParam] = fixedSlots;
          } else if (GET_REQUEST_PATHS.days === path) {
            for (let i = 1; i <= num_days_month; i++) {
              freeSlots[i] = fixedSlots;
            }
          }
        }
        console.log(freeSlots);
      });
    } catch (err) {
      console.error(err.message);
    }
  }
};

const checkParameters = (params, checkDayParams) => {
  if (params.year == null) {
    return errorMessages.types.MISSING_YEAR;
  }
  if (isNaN(Number(params.year))) {
    return errorMessages.types.INVALID_YEAR;
  }
  if (params.month == null) {
    return errorMessages.types.MISSING_MONTH;
  }
  if (isNaN(Number(params.month)) || params.month < 1 || params.month > 12) {
    return errorMessages.types.INVALID_MONTH;
  }
  if (checkDayParams) {
    if (params.day == null) {
      return errorMessages.types.MISSING_DAY;
    }

    if (isNaN(Number(params.day)) || params.day < 1 || params.day > 31) {
      return errorMessages.types.INVALID_DAY;
    }
  }
  return errorMessages.types.VALID_PARAMETERS;
};

const getAvailableSlots = busySlots => {
  const freeSlots = [];
  overlap = false;
  fixedSlots.forEach((slot, index) => {
    const slotStartTime = convertToMilliseconds(slot.start);
    const slotEndTime = convertToMilliseconds(slot.end);
    for (busySlot of busySlots) {
      const busyStartDate = new Date(busySlot.startDate);
      const busyEndDate = new Date(busySlot.endDate);
      const busyStartTime = convertToMilliseconds(
        `${busyStartDate.getHours()}:${busyStartDate.getMinutes()}`
      );
      //console.log(busyStartTime);

      //console.log(convertToMilliseconds("13:30"));
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
      freeSlots.push({ starTime: slot.start, endTime: slot.end });
    }
  });
  return freeSlots;
};

const convertToMilliseconds = string => {
  const times = string.split(":");
  const timeMilleSeconds =
    1000 * (Number(times[0] * 60 * 60) + Number(times[1] * 60));
  return timeMilleSeconds;
};

const isBooking24HoursAdvance = date => {
  const oneDay = 60 * 60 * 24 * 1000;
  const expectedBookingTime = date.setTime(date.getTime() - oneDay);
  const currentTime = Date.now();
  return expectedBookingTime - currentTime >= oneDay;
};

const isWeekDay = (year, month, day) => {
  const dayInMonth = new Date(year, month - 1, day).getDay();
  console.log(dayInMonth);
  console.log(dayInMonth != 0 && dayInMonth != 6);
  return dayInMonth != 0 && dayInMonth != 6;
};

const getDaysInAMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

//isBooking24HoursAdvance(new Date());
//retrieveWeekDaysInMonth(2011, 10);
//isDateAWeekDay(new Date());
//const endDate = new Date();
//endDate.setMinutes(endDate.getMinutes() + 40);
//isAppointment40MinutesLong(new Date(), endDate);
//isWeekDay(2019, 9, 6);
module.exports = bookings;
