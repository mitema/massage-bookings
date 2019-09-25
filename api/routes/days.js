const express = require("express");
const route = express.Router();
const DayService = require("../../services/DaysService");
const Validators = require("../middlewares/Validators");

route.get("/days", async (req, res) => {
  try {
    const validate_parameters_response = Validators.validateQueryParams(
      req.query,
      //check year && month by default
      false, // check day Params
      false // check time params
    );
    if (validate_parameters_response.success) {
      const { year, month } = req.query;
      const freeSlots = await DayService.getDays(year, month);
      return res.json(freeSlots);
    }
    return res.json(validate_parameters_response);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = route;
