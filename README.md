# massage-bookings
run : npm run server
Open google api authentication link from CLI
REtreive code and enter code in CLI
Token.json is created, also check the file if a valid access token was received
Access EndPoints with valid Token

ACCESS ENDPOINTS FROM BROWSER : https://massge-booking-server.appspot.com

ENDPOINTS
Request :
GET  /days?year=yyyy&month=mm

Sample Response:
{
  "success": true,
  "days": [
    { "day": 1,  "hasTimeSlots": false },
    ...
    { "day": 31, "hasTimeSlots": true }
  ]
}

Request:
GET  /timeslots?year=yyyy&month=mm&day=dd

Sample Response:
{
  "success": true,
  "timeSlots": [
    {
      "startTime": "2019-09-04T09:00:00.000Z",
        "endTime": "2019-09-04T09:40:00.000Z"
    },
    {
      "startTime": "2019-09-04T09:45:00.000Z",
        "endTime": "2019-09-04T10:25:00.000Z"
    },
    ...
  ]
}

Request:
POST  /book?year=yyyy&month=MM&day=dd&hour=hh&minute=mm

Sample Response:
{
    "success": true,
  "startTime": "2019-09-04T10:30:00.000Z",
    "endTime": "2019-09-04T11:10:00.000Z"
}


