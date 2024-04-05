import dayjs, { Dayjs, ManipulateType, OptionType } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import weekday from "dayjs/plugin/weekday";
import { without } from "lodash";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);
dayjs.extend(weekday);

// Ensure time zone is in sg time. Will only affect dayjs.tz() not dayjs()
const tz = "Asia/Singapore";
dayjs.tz.setDefault(tz);

/**
 * Things to note:
 *
 * 1. dayjs.tz(date) will parse date object and datetime string without timezone to sg timezone. DO NOT use datetime string with timezone, result returned will be incorrect.
 * 2. dayjs(date).tz() will convert date object and datetime string to sg timezone. Be careful! If date string does not have timezone, it will assume local timezone before conversion.
 * 3. dayjs() by itself is not affected by setDefault time. It will always assume local timezone.
 *
 * Therefore,
 * - If user provide datetime with timezone string, use dayjs(date).tz().
 * - If user provide datetime without timezone string, use dayjs.tz(date).
 * - If user provided date object, both dayjs(date).tz() and dayjs.tz(date) are ok to use.
 */

/**
 * ISO 8601 Format for datetime
 */
export const acceptableDateTimeFormat = [
  "YYYY-MM-DDTHH:mm:ssZ",
  "YYYY-MM-DDTHH:mm:ss.sss[Z]",
];

/**
 * Convert or parse date object or string to SG timezone correctly.
 * @param dt Can be date object, string or number (unix). datetime string with timezone must be in ISO format: 2023-01-16T05:23:29+00:00 or 2023-01-16T05:23:29Z. Optional.
 * @returns dayjs object.
 */
function cp(dt?: Date | string | number): Dayjs {
  if (typeof dt === "string" && dayjs(dt, acceptableDateTimeFormat).isValid())
    return dayjs(dt).tz();

  return dayjs.tz(dt);
}

/**
 *
 * @param date the date to combine time with
 * @param time the time in 'HH:mm:ss' or 'HH:mm:ss' format
 * @param treatLocal Defaults to true. If true, existing date treated as sg date e.g. '2023-01-30T00:00:00+00:00' will be treated as '2023-01-30T00:00:00+08:00'
 * @returns the combined date object
 */
export function combineDateAndTime(
  date: Date | string | number,
  time: string,
  treatLocal = true
) {
  date = treatLocal ? dayjs(date).tz(tz, true).toDate() : date;
  const d = cp(date); // specify date is already in SGT
  const [h, m, s] = time.split(":");
  const dWithHourAndMinute = d
    .add(parseInt(h), "hour")
    .add(parseInt(m), "minute");
  if (s) {
    return dWithHourAndMinute.add(parseInt(s), "second").toDate();
  }
  return dWithHourAndMinute.toDate();
}

/**
 *
 * @param bookingDateTimeArray [date, time]
 * @param requestedDateTime the datetime to compare with
 * @returns true if time difference is >= 15, else return false
 */
export function withinCheckinWindow(
  bookingDateTimeArray: string[],
  requestedDateTime: Date | string | number
) {
  const bookingDateTime = combineDateAndTime(
    bookingDateTimeArray[0],
    bookingDateTimeArray[1]
  );
  const booking = cp(bookingDateTime);
  const requested = cp(requestedDateTime);
  const diff = Math.abs(booking.diff(requested, "minute", true));
  // Return false if the difference is > 15 minutes
  return diff <= 15 ? true : false;
}

/**
 *
 * @returns current date object
 */
export function getDateTimeNow() {
  return dayjs().toDate();
}

/**
 * Formats given datetime or current datetime.
 * @param date optional. If empty, will format current datetime.
 * @param format optional. Defaults to "YYYY-MM-DD".
 * @returns date string.
 */
export function getDateString(
  date?: Date | string | number,
  format = "YYYY-MM-DD"
) {
  return cp(date).format(format);
}

/**
 * Returns date object.
 */
export function getDateTime(datetime: Date | string | number) {
  return cp(datetime).toDate();
}

/**
 * Returns a boolean indicating whether the Dayjs's datetime is valid.
 *
 * @param datetime
 * @param strict Optional. If true, checks if it is a valid date too. Defaults to false.
 * @param format Optional. Specify the format of datetime. Defaults to "YYYY-MM-DDTHH:mm:ssZ".
 * @returns boolean
 */
export function isValidDate(
  datetime: Date | string,
  strict = false,
  format: OptionType = "YYYY-MM-DDTHH:mm:ssZ"
) {
  // workaround as unable to use dayjs isValid() due to bug when using strict mode with timezone. https://github.com/iamkun/dayjs/issues/929
  if (strict && typeof datetime === "string") {
    // replace +-HH:mm and +-HHmm with current tz offset
    const tzOffset = dayjs().format("Z");
    const tzOffset2 = dayjs().format("ZZ");
    datetime = datetime
      .replace(/[+-]\d\d:\d\d$/, tzOffset)
      .replace(/[+-]\d\d\d\d$/, tzOffset2);
  }
  return dayjs(datetime, format, strict).isValid();
}

/**
 * Indicate if `datetime1` is >= `datetime2`
 * @param datetime1
 * @param datetime2
 * @returns True or False
 */
export function datetimeIsSameOrAfter(
  datetime1: Date | string | number,
  datetime2: Date | string | number
) {
  const a = cp(datetime1);
  const b = cp(datetime2);
  return a.isSameOrAfter(b);
}

/**
 * Indicate if `datetime1` > `datetime2`
 * @param datetime1
 * @param datetime2
 * @returns True or False
 */
export function datetimeIsAfter(
  datetime1: Date | string | number,
  datetime2: Date | string | number
) {
  const a = cp(datetime1);
  const b = cp(datetime2);
  return a.isAfter(b);
}

/**
 * Returns `true` if datetime is within the window else return `false`.
 *
 * Window is inclusive of start and exclusive of end.
 * @param current the datetime to be checked.
 * @param start the window start datetime.
 * @param end the window end datetime.
 */
export function isWithinDatetimeWindow(
  current: Date | string | number,
  start: Date | string | number,
  end: Date | string | number
) {
  const datetime = cp(current);
  const startDatetime = cp(start);
  const endDatetime = cp(end);

  return (
    datetime.isSameOrAfter(startDatetime) && datetime.isBefore(endDatetime)
  );
}

/**
 * Return an array of business dates.
 * @param startDate starting from this day
 * @param endDate ending on this date (inclusive)
 * @param excludeDates optional. Exclude these dates from result
 */
export function getBusinessDates(
  startDate: Date | string,
  endDate: Date | string,
  excludeDates: (Date | string)[]
) {
  if (
    !isValidDate(startDate, true, "YYYY-MM-DD") ||
    !isValidDate(endDate, true, "YYYY-MM-DD")
  )
    throw new Error("startDate or endDate is not valid");

  const start = cp(startDate);
  const end = cp(endDate);

  const exclude = excludeDates.map((d) => cp(d).format("YYYY-MM-DD"));
  const businessDates: string[] = [];

  let curDate = start;
  while (curDate.isSameOrBefore(end)) {
    const day = curDate.day();

    if (day !== 0 && day !== 6) {
      businessDates.push(curDate.format("YYYY-MM-DD"));
    }

    curDate = curDate.add(1, "day");
  }

  const result = without(businessDates, ...exclude);
  return result;
}

/**
 * Returns current time in Singapore.
 * @returns the current time in HH:mm format
 */
export function getTimeNow() {
  return cp().format("HH:mm");
}

/**
 * Return the incremented time using the passed interval.
 * @author Manikam
 * @param startTime starting from this time
 * @param interval timeslot interval
 */
export function addMinutesToTimeslot(startTime: string, interval: number) {
  const [h, m, s] = startTime.split(":");
  const date = cp("2022-01-01")
    .add(parseInt(h), "hour")
    .add(parseInt(m), "minute")
    .add(parseInt(s), "second")
    .add(interval, "minute");
  return date.format("HH:mm:ss");
}

/**
 * Return an array of business timeslots given a start and end time.
 * @author Manikam
 * @param startTime starting from this start time
 * @param endTime ending on this start time
 * @param interval interval to generate timeslot (10, 15, or 30 or could be any number rounded to the tenth or fives)
 */
export function getBusinessTimeslots(
  startTime = "08:30:00",
  endTime = "18:30:00",
  interval = 30
) {
  // check if startTime and endTime is valid
  let sTime = dayjs(startTime, "HH:mm:ss", true);
  const eTime = dayjs(endTime, "HH:mm:ss", true);

  if (!sTime.isValid() || !eTime.isValid())
    throw new Error("Invalid startTime or endTime");

  const timeslots: string[] = [];

  // while starttime is not equal to endtime increment starttime and generate slots and push to array
  while (sTime.isBefore(eTime)) {
    const tempEndTime = sTime.add(interval, "minute");
    timeslots.push(
      `${sTime.format("HH:mm:ss")}-${tempEndTime.format("HH:mm:ss")}`
    );
    sTime = tempEndTime;
  }
  return timeslots;
}

/**
 * Indicates the difference between two date-time in the specified unit.
 * @param start start datetime
 * @param end end datetime
 * @param format the format of start and end datetime. Default is "HH:mm:ss"
 * @param unit unit of the difference. Default is "second"
 * @returns the difference of start and end in unit specified
 */
export function datetimeDiff(
  start: string | Date,
  end: string | Date,
  format: string | OptionType = "HH:mm:ss",
  unit: "second" | "minute" | "hour" | "day" = "second"
) {
  const s = typeof start === "string" ? dayjs(start, format) : dayjs(start);
  const e = typeof end === "string" ? dayjs(end, format) : dayjs(end);
  return e.diff(s, unit);
}

/**
 * Returns the date of the relative day. In sg, sunday is the first day of the week. Therefore, `getRelativeDate(0)` will be the sunday of this week.
 * `getRelativeDate(-7)` will return previous week's sunday, getRelativeDate(7) will return next week's sunday.
 * @param day day of the week. Ranges from 0-6, where 0 is a Sunday in sg locale.
 */
export function getRelativeDate(day: number) {
  return dayjs().weekday(day).toDate();
}

/**
 * Add or subtract duration from date.
 * @param date Datetime. Defaults to current datetime.
 * @param duration The duration to add e.g. '1 day', '-15 minute'. For all options see https://day.js.org/docs/en/manipulate/add
 * @returns date object
 */
export function addDuration(
  date: Date | string | number = new Date(),
  duration: number,
  unit?: ManipulateType | undefined
) {
  const d = cp(date);
  return d.add(duration, unit).toDate();
}

/**
 * Converts date to Unix Timestamp.
 * @param date the date to be converted.
 * @param seconds Specify if unix should be in milliseconds or seconds. Defaults to false.
 * @returns Unix timestamp.
 */
export function convertToUnix(
  date: Date | string | number = new Date(),
  seconds = false
) {
  return seconds ? cp(date).unix() : cp(date).valueOf();
}
