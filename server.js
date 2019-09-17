const express = require("express");
const app = express();
const connectDB = require("./config/db");

app.use(express.json({ extended: false }));
//Define Routes
//app.use("/api/days", require("./routes/days"));
app.use("/api/bookings", require("./routes/bookings"));
//app.use("/api/timeSlots", require("./routes/timeSlots"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
