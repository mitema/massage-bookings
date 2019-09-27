const express = require("express");
const route = express.Router();
const BookingService = require("../../services/BookingService");
const Validators = require("../middlewares/Validators");

route.post("/book", async (req, res) => {
  try {
    const validate_parameters_response = Validators.validateQueryParams(
      req.query,
      //check year && month by default
      true, // check day Params
      true // check hour && time params
    );

    if (validate_parameters_response.success) {
      const { year, month, day, hour, minute } = req.query;
      const freeSlots = await BookingService.createBooking(
        year,
        month,
        day,
        hour,
        minute
      );

      return res.json(freeSlots);
    }
    return res.json(validate_parameters_response);
  } catch (err) {
    console.log(err.message);
  }
});
module.exports = route;
