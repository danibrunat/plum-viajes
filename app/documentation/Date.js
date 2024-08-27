/**
 * @typedef {Object} DateTransformer
 * @property {function(string)} toFormat return a date with string format
 * @property {function} toDate return a date
 * @property {function} toUnix return a date with Unix format
 * @property {function} getMonth return date month
 * @property {function} getYear return date year
 * @property {function} getDay return date day
 * @property {function(Date)} compareIsAfter return if the date is after the date parameter
 * @property {function(Date)} compareIsBefore return if date is before than date parameter
 * @property {function(Date, 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds' | undefined, boolean)} getDifference undefined is default milliseconds
 * @property {function} getUnixTimeStamp return a date with Unix timestamp
 * @property {function} isValid returns true if is valid date
 **/

const date = {};

export default date;
