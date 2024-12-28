import moment from "moment";
import "moment/locale/es-do";
import DateTransformer from "../documentation/Date";

/**
 * Usage:
 * Dates.get().toFormat("YYYYMMDD")
 */

/**
    String formats examples

    Input     | Example        | Description
              |                |
    YYYY      |	2014           | 4 or 2 digit year. Note: Only 4 digit can be parsed on strict mode
    YY        | 14             | 2 digit year
    Y         | -25            | Year with any number of digits and sign
    Q         | 1..4           | Quarter of year. Sets month to first month in quarter.
    M MM      | 1..12          | Month number
    MMM MMMM  | Jan..December  | Month name in locale set by moment.locale()
    D DD      | 1..31          | Day of month
    Do        | 1st..31st      | Day of month with ordinal
    DDD DDDD  | 1..365         | Day of year
    X         | 1410715640.579 | Unix timestamp
    x         | 1410715640579  | Unix ms timestamp
 */

/**
 * @param {string} initialDate
 * @param {string | null} initialFormat
 * @returns {moment.Moment}
 **/
const initialize = (initialDate, initialFormat = null) => {
  if (initialFormat) {
    return moment(initialDate, initialFormat);
  }
  return moment(initialDate);
};

/**
 * dateCreated: in this case Moment Object
 * @param {moment.Moment} momentDate
 * @returns {DateTransformer}
 */
const transform = (momentDate) => {
  return {
    toDate: () => momentDate.toDate(),
    toFormat: (format) => momentDate.format(format),
    toUnix: () => momentDate.unix(),
    getMonth: () => momentDate.month(),
    getYear: () => momentDate.year(),
    getDay: () => momentDate.day(),
    compareIsAfter: (date) => momentDate.isAfter(moment(date)),
    compareIsBefore: (date) => momentDate.isBefore(moment(date)),
    getDifference: (date, unitOfTime, precise = false) =>
      momentDate.diff(moment(date), unitOfTime, precise),
    getUnixTimeStamp: () => momentDate.valueOf(),
    isValid: () => momentDate.isValid(),
    // Add other final functions to date created
  };
};

const Dates = {
  /**
   * @param {Date | string | null} initialDate default new Date()
   * @param {string | null} initialFormat It is optional initial date format
   * @returns {DateTransformer}
   */
  get: (initialDate = new Date(), initialFormat = null) => {
    const date = initialize(initialDate, initialFormat);

    return transform(date);
  },
  /**
   * @param {number} numberOfMinutes The number of minutes to add
   * @param {Date | string | null} initialDate default new Date()
   * @param {string | null} initialFormat It is optional initial date format
   * @returns {DateTransformer}
   */
  getWithAddMinutes: (
    numberOfMinutes,
    initialDate = new Date(),
    initialFormat = null
  ) => {
    const date = initialize(initialDate, initialFormat);

    return transform(date.add(numberOfMinutes, "minutes"));
  },
  /**
   * @param {number} numberOfDays The number of days to add
   * @param {Date | string | null} initialDate default new Date()
   * @param {string | null} initialFormat It is optional initial date format
   * @returns {DateTransformer}
   */
  getWithAddDays: (
    numberOfDays,
    initialDate = new Date(),
    initialFormat = null
  ) => {
    const date = initialize(initialDate, initialFormat);

    return transform(date.add(numberOfDays, "days"));
  },
  /**
   * @param {number} numberOfDays The number of days to subtract
   * @param {Date | string | null} initialDate default new Date()
   * @param {string | null} initialFormat It is optional initial date format
   * @returns {DateTransformer}
   */
  getWithSubtractDays: (
    numberOfDays,
    initialDate = new Date(),
    initialFormat = null
  ) => {
    const date = initialize(initialDate, initialFormat);

    return transform(date.subtract(numberOfDays, "days"));
  },
  /**
   * @param {number} numberOfYears The number of years to add
   * @param {Date | string | null} initialDate default new Date()
   * @param {string | null} initialFormat It is optional initial date format
   * @returns {DateTransformer}
   */
  getWithAddYears: (
    numberOfYears,
    initialDate = new Date(),
    initialFormat = null
  ) => {
    const date = initialize(initialDate, initialFormat);

    return transform(date.add(numberOfYears, "years"));
  },
  /**
   * @param {number} numberOfYears The number of years to subtract
   * @param {Date | string | null} initialDate default new Date()
   * @param {string | null} initialFormat It is optional initial date format
   * @returns {DateTransformer}
   */
  getWithSubtractYears: (
    numberOfYears,
    initialDate = new Date(),
    initialFormat = null
  ) => {
    const date = initialize(initialDate, initialFormat);

    return transform(date.subtract(numberOfYears, "years"));
  },
  /**
   * @param {number} numberOfMonths The number of months to add
   * @param {Date | string | null} initialDate default new Date()
   * @param {string | null} initialFormat It is optional initial date format
   * @returns {DateTransformer}
   */
  getWithAddMonths: (
    numberOfMonths,
    initialDate = new Date(),
    initialFormat = null
  ) => {
    const date = initialize(initialDate, initialFormat);

    return transform(date.add(numberOfMonths, "months"));
  },
  /**
   * @param {number} numberOfMonths The number of months to subtract
   * @param {Date | string | null} initialDate default new Date()
   * @param {string | null} initialFormat It is optional initial date format
   * @returns {DateTransformer}
   */
  getWithSubtractMonths: (
    numberOfMonths,
    initialDate = new Date(),
    initialFormat = null
  ) => {
    const date = initialize(initialDate, initialFormat);

    return transform(date.subtract(numberOfMonths, "months"));
  },
  /**
   * @param {Date | string | null} initialDate default new Date()
   * @param {string | null} initialFormat It is optional initial date format
   * @returns {DateTransformer}
   */
  getStartDateOfMonth: (initialDate = new Date(), initialFormat = null) => {
    const date = initialize(initialDate, initialFormat);

    return transform(date.startOf("month"));
  },
  /**
   * @param {Date | string | null} initialDate default new Date()
   * @param {string | null} initialFormat It is optional initial date format
   * @returns {DateTransformer}
   */
  getEndDateOfMonth: (initialDate = new Date(), initialFormat = null) => {
    const date = initialize(initialDate, initialFormat);

    return transform(date.endOf("month"));
  },
};

export default Dates;
