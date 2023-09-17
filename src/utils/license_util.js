function char2code(c) {
  //0~35
  const num = c.charCodeAt(0)
  if (num >= 48 && num <= 57) {//0~9
    return num - 48
  }
  if (num >= 65 && num <= 90) {//10~35
    return num - 65 + 10
  }
  throw new Error("错误的char:", c)
}

function code2char(num) {
  let ascii_code
  if (num >= 0 && num < 10) {
    ascii_code = num + 48
  } else if (num >= 10 && num <= 35) {
    ascii_code = num - 10 + 65
  } else {
    throw new Error("错误的num:", num)
  }

  return String.fromCharCode(ascii_code)
}


function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function randNumber() {
  return randomIntFromInterval(0, 35)
}

function createKey(aim_remain = 2) {
  let arr = []
  for (let i = 0; i < 4; i++) {
    const num = randNumber()
    arr.push(num)
  }

  const final_num = getFinalNumber(arr_sum(arr), aim_remain)
  arr.push(final_num)

  if (arr_sum(arr) % 35 !== aim_remain) {
    throw new Error("总和校验失败")
  }
  return arr.map(v => code2char(v)).join("")
}

function getFinalNumber(cur_sum, aim_remainder) {
  const cur_remainder = cur_sum % 35
  if (cur_remainder === aim_remainder) {
    return 0
  }

  if (cur_remainder < aim_remainder) {
    return aim_remainder - cur_remainder
  }
  return 35 - cur_remainder + aim_remainder
}


function arr_sum(arr) {
  return arr.reduce((partialSum, a) => partialSum + a, 0);
}

function check(text, aim_remain) {
  let sum_val = 0
  for (const c of text) {
    sum_val += char2code(c)
  }
  return sum_val % 35 === aim_remain
}

function create_full_key() {
  const tmp = [2, 5, 2, 6].map(v => createKey(v)).join("-")
  valid_full_key(tmp)
  return tmp
}

function valid_full_key(text) {
  const arr = text.trim().split("-")
  // console.log(arr)
  const aim = [2, 5, 2, 6]
  if (arr.length !== aim.length) {
    return false
  }
  for (let i = 0; i < arr.length; i++) {
    if (!check(arr[i], aim[i])) {
      return false
    }
  }
  return true
}

console.log(create_full_key())
