export class AppErrorCodes {
  public static readonly INTERNAL_ERROR = {
    code: 100,
    msg: "Opps!! Something went wrong, pleae contact the support.",
  };
  public static readonly BOOKING_NOT_POSSIBLE = {
    code: 101,
    msg: "Booking unsuccessful, it is been booked or unable to book alone.",
  };
  public static readonly USER_DATA_MISSING = {
    code: 102,
    msg: "User information missing!!",
  };
  public static readonly BOOKING_UNSUCCESSFULL = {
    code: 103,
    msg: "Booking not successfull!!",
  };
  public static readonly ROOM_CAPACITY_ERROR = {
    code: 104,
    msg: "Please provide the capacity",
  };
  public static readonly ENTITY_INDEX_UUID_REQUIRED = {
    code: 105,
    msg: "Please provide the entity uuid",
  };

  public static readonly NO_RECORDS_TO_UPDATE = {
    code: 106,
    msg: "Records not available for update",
  };
  public static readonly CHECKIN_NOT_POSSIBLE = {
    code: 107,
    msg: "Unable to check in as booking does not belong to user.",
  };

  public static readonly CANCEL_BOOKING_EXCEPTION = {
    code: 108,
    msg: "Cancel not possible ",
  };

  public static readonly MY_BOOKING_NO_BOOKINGS = {
    code: 109,
    msg: "No bookings available, try to book new slot.",
  };

  public static readonly REQ_QUERY_INPUT_MISSING_PAGINATION = {
    code: 110,
    msg: "Please send following inputs in query - ?limit=<>&page=<>",
  };

  public static readonly CHECKOUT_NOT_POSSIBLE = {
    code: 111,
    msg: "Check-out unsuccessfull",
  };

  public static readonly CREATE_BOOKING_PHONE_NOT_PROVIDED = {
    code: 112,
    msg: "The type Room & Event hall must required remarks with contact number and title",
  };

  public static readonly CREATE_BOOKING_PHONE_NOT_IN_FORMAT = {
    code: 112,
    msg: "Phone number not in format!!",
  };

  public static readonly NO_BOOKING_FOUND = {
    code: 113,
    msg: "No matching booking found.",
  };

  public static readonly MISSING_REQ_BODY_PROPERTIES = {
    code: 114,
    msg: "Required properties invalid or missing from request body.",
  };

  public static readonly S3_PUT_OBJECT_ERROR = {
    code: 115,
    msg: "Error uploading to s3.",
  };

  public static readonly NO_BOOKING_OR_SPENDING = {
    code: 116,
    msg: "No such booking or spendings to fulfill requirement for ending trip",
  };

  public static readonly MISSING_ODOMETER_DATA = {
    code: 117,
    msg: "No receipt image data / odometer image data / odometer reading is found",
  };

  public static readonly S3_Get_OBJECT_ERROR = {
    code: 118,
    msg: "Error fetching s3 object.",
  };

  public static readonly INVALID_ODOMETER_READING = {
    code: 119,
    msg: "Odometer reading must be greater or equal to previous reading",
  };

  public static readonly TRIP_BOOKING_MISMATCH = {
    code: 120,
    msg: "Provided trip and booking are not associated with one another",
  };

  public static readonly NO_SPENDING_FOUND = {
    code: 121,
    msg: "No matching spending found.",
  };

  public static readonly MISSING_REQ_QUERY_PROPERTIES = {
    code: 122,
    msg: "Required properties missing from request query.",
  };

  public static readonly DO_NOT_EXIST_OR_NO_PERMISSION = {
    code: 123,
    msg: "Either the values in your req body do not exist, or you do not have permission to make the request.",
  };

  public static readonly CHECKIN_QR_CODE_INVALID = {
    code: 124,
    msg: "Wrong QR code scanned. Please scan the correct QR code.",
  };
  public static readonly CHECKIN_QR_CODE_WRONG_DAY = {
    code: 125,
    msg: "Checking in on the wrong day. Please make sure the booking is today.",
  };
  public static readonly CHECKIN_QR_CODE_OUTSIDE_CHECKIN_WINDOW = {
    code: 126,
    msg: "You can only check in within 15 minutes of your booking.",
  };
}
