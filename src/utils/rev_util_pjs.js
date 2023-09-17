import time_util from "@/utils/time_util"

function replaceAll(string, search, replacement) {
  return string.replace(new RegExp(search, 'g'), replacement);
}

function str2span(spanStr) {
  //进行转化:
  let arr = replaceAll(spanStr.trim(), "，", ",").split(",");
  //变成数组:
  // console.log(arr);
  let tmp = [];
  let len = 0;
  for (let v of arr) {
    let i = parseInt(v);
    if (i > 0) {//不接受负数与0
      tmp.push(i);
      len = len + 1;
    }
  }
  return tmp
}

function span2str(span) {
  if (span instanceof Array) {
    if (span.length > 0) {
      return span.join("，")
    }
  }
  return "无"
}


function calc_last_rev_date_obj(note) {
  let lastRevAt
  const rev_history = note.rev_history || []
  if (rev_history.length === 0) {//首次复习
    lastRevAt = note.rev_learned_at
  } else {
    const last = rev_history[rev_history.length - 1]
    lastRevAt = last.time
  }
  return lastRevAt
}

function getDiffStr(diff) {
  diff = parseInt(diff)
  if (diff === 0) {
    return "今日"
  }
  if (diff === 1) {
    return "昨日"
  }
  return diff + "天前"
}


function needTodayRev(note) {
  if (!note || note.rev_state !== 'rev') {
    return false
  }
  //next rev at
  const plan = note.rev_plan[0]
  if (!plan) {
    return
  }
  const todayEnd_ms = time_util.dateEnd(new Date())
  return plan.getTime() <= todayEnd_ms
}


function revLastAtText(note) {
  try {
    const his = note.rev_history
    return time_util.date2str(his[his.length - 1].time, true)
  } catch (e) {
    return "无"
  }
}

function revNextAtText(note) {
  let date
  try {
    date = note.rev_plan[0]
  } catch (e) {
    return "无"
  }

  const diff = time_util.getDayDiff_tz(date, new Date())
  if (diff === 0) {
    return "今日"
  }
  if (diff === -1) {
    return "昨日"
  }
  if (diff === 1) {
    return "明日"
  }

  if (diff < 0) {
    return `${-diff} 天前`
  }

  return `${diff} 天后`
}


function noteRevStateDescText(note) {
  if (note.rev_state === "pause") {
    return "复习暂停"
  }

  if (!note || note.rev_plan.length === 0) {
    return
  }
  const date = note.rev_plan[0]
  const days = time_util.getDayDiff_tz(date, new Date())
  let day
  if (days === 0) {
    day = "今天"
  } else if (days < 0) {
    day = `${-days}天前`
  } else {
    day = `${days}天`
  }
  return "下次复习:" + day
}


export default {
  str2span,
  span2str,
  calc_last_rev_date_obj,
  noteRevStateDescText,
  needTodayRev,
  revLastAtText,
  revNextAtText
}
