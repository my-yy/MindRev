import moment from "moment";

const FORMAT = 'YYYY-M-D HH:mm:ss'
const FORMAT_SHORT = 'YYYY-M-D'

function dateEnd(date) {
  //返回的是ms
  return new Date(date.getTime()).setHours(23, 59, 59, 999)
}

const ONE_DAY_MS = 1000 * 24 * 3600


function tomorrowStr(short = false) {
  const tomorrow = dateAddDays(new Date(), 1)
  return date2str(tomorrow, short)
}

function dateAddDays(d1, days) {
  return new Date(d1.getTime() + days * ONE_DAY_MS)
}

function todayAddDays(days) {
  return new Date(new Date().getTime() + days * ONE_DAY_MS)
}


function str2date(str, short = false) {
  return moment(str, short ? FORMAT_SHORT : FORMAT).toDate();
}

function date2str(date, short) {
  return moment(date).format(short ? FORMAT_SHORT : FORMAT)
}


function getDayDiff_tz(day1, day2) {
  day1 = dateEnd(day1);
  day2 = dateEnd(day2);
  return moment(day1).diff(day2, 'days');
}


function getDateDesc(date) {
  if (date == null) {
    return "null"
  }
  if (typeof date == "string") {
    date = new Date(date);
  }
  let today = new Date();
  let span = getDayDiff_tz(date, today);
  if (span === 0) {
    return "今日"
  } else if (today > date) {
    return `${-span}天前`
  } else {
    return `${span}天后`
  }
}

export default {
  str2date,
  date2str,
  getDateDesc,
  getDayDiff_tz,
  dateAddDays,
  dateEnd,
  tomorrowStr,
  todayAddDays,
  ONE_DAY_MS
}
