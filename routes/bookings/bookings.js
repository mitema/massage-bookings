const authClient = require("../../config/connection");
const auth = authClient();

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
module.exports= { 
    
    listAvailableDays=()=> {
        const calendar = google.calendar({ version: "v3", auth });
        calendar.events.list(
          {
            calendarId: "primary",
            timeMin: new Date().toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: "startTime"
          },
          (err, res) => {
            if (err) return console.log("The API returned an error: " + err);
            const events = res.data.items;
            if (events.length) {
              console.log("Upcoming 10 events:");
              events.map((event, i) => {
                const start = event.start.dateTime || event.start.date;
                console.log(`${start} - ${event.summary}`);
                console.log(event.kind);
              });
            } else {
              console.log("No upcoming events found.");
            }
          }
        );
      },

       createBooking = () => {
        var event = {
          summary: "Google I/O 2015",
          location: "800 Howard St., San Francisco, CA 94103",
          description: "A chance to hear more about Google's developer products.",
          transparency: "opaque",
          start: {
            dateTime: new Date().toISOString()
          },
          end: {
            dateTime: new Date().toISOString()
          }
        };
        const calendar = google.calendar({ version: "v3", auth });
        calendar.events.insert(
          {
            auth: auth,
            calendarId: "primary",
            resource: event
          },
          function(err, event) {
            if (err) {
              console.log(
                "There was an error contacting the Calendar service: " + err
              );
              return;
            }
            console.log(event);
            console.log("Event created: %s", event);
          }
        );
      },
      
       getAvailableSlots = () => {
        const calendar = google.calendar({ version: "v3", auth });
        const check = {
          auth: auth,
          resource: {
            timeMin: "2018-03-02T08:00:00.000Z",
            timeMax: "2018-03-02T16:00:00.000Z",
      
            items: [{ id: calendar.name }]
          }
        };
      
        calendar.freebusy.query(check, function(err, event) {
          if (err) {
            console.log("There was an error contacting the Calendar service: " + err);
            return;
          }
          console.log(event);
        });
    }
}

