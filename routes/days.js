const express = require("express");
const router = express.Router();

//@route    POST api/users
//@desc     Return the days in a month that             have available time slots.
//@access   Public

router.get("/", (req, res) => {
  res.send("Days in a month with available slots");
});

module.exports = router;
