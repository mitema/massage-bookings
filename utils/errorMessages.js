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
    },
    MISSING_HOUR: {
      success: false,
      message: "Request is missing parameter: hour"
    },
    MISSING_MINUTES: {
      success: false,
      message: "Request is missing parameter: minute"
    },
    INVALID_HOUR: {
      success: false,
      message: "invalid hour"
    },
    INVALID_MINUTES: {
      success: false,
      message: "invalid minute"
    },
    INVALID_TIMESLOT: {
      success: false,
      message: "Invalid time slot"
    },
    INVALID_BOOKING_DATE: {
      success: false,
      message: "Cannot book with less than 24 hours in advance"
    },
    INVALID_DAY: {
      success: false,
      message: "invalid day"
    },
    INVALID_BOOK_DAY: {
      success: false,
      message: "Cannot book outside bookable timeframe"
    },
    INVALID_BOOK_TIME: {
      success: false,
      message: "Cannot book time in the past"
    },
    AUTH_FAILURE: {
      success: false,
      message: "Authentication failed: check if token valid"
    }
  }
};
