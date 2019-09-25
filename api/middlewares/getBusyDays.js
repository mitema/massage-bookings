const { google } = require("googleapis");

const getBusyDays = async check => {
  return new Promise(async (res, reject) => {
    const auth = check.auth;
    let days = {};
    let busySlots = [];
    const calendar = google.calendar({ version: "v3", auth });
    calendar.freebusy.query(check, (err, result) => {
      if (err) return console.log("The API returned an error: " + err);
      busySlots = result.data.calendars.primary.busy;
      if (busySlots.length > 0) {
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
      }
      res(days);
    });
  }).catch(err => {
    console.log("Error getting busy days");
  });
};

module.exports = getBusyDays;
