const express = require("express");
const route = express.Router();
const TimeSlotService = require("../../services/TimeSlotService");
const Validators = require("../middlewares/Validators");

route.get("/timeslots", async (req, res) => {
  try {
    const validate_parameters_response = Validators.validateQueryParams(
      req.query,
      //check year && month by default
      true, // check day Params
      false // check time params
    );
    if (validate_parameters_response.success) {
      const { year, month, day } = req.query;
      const freeSlots = await TimeSlotService.getTimeSlots(year, month, day);
      return res.json(freeSlots);
    }
    return res.json(validate_parameters_response);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = route;
