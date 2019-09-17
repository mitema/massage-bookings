const mongoose = require("mongoose");

const DaysSchema = mongoose.Schema({
  month: {
    type: String,
    required: true
  },
  days: {
    type: Array,
    required: true
  }
});

module.exports = mongoose.model("days", DaysSchema);
