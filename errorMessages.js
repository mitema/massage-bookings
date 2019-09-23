module.exports = {
  types: {
    MISSING_MONTH: {
      success: false,
      message: "Request is missing parameter: month"
    },
    MISSING_YEAR: {
      success: false,
      message: "Request is missing parameter: year"
    },
    MISSING_DAY: {
      success: false,
      message: "Request is missing parameter: day"
    },
    INVALID_MONTH: {
      success: false,
      message: "Invalid month"
    },
    INVALID_YEAR: {
      success: false,
      message: "Invalid year"
    },
    INVALID_DAY: {
      success: false,
      message: "Invalid day"
    },
    VALID_PARAMETERS: {
      success: true,
      message: "valid parameters"
    }
  }
};
