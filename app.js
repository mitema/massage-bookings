const express = require("express");
const app = express();
app.use(express.json({ extended: false }));
const bookings = require("./api/routes/bookings");
const days = require("./api/routes/days");
const timeSlots = require("./api/routes/timeSlots");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

//Define Routes
app.use("/", days);
app.use("/", timeSlots);
app.use("/", bookings);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
