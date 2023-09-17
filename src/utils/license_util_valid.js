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


function check(text, aim_remain) {
  let sum_val = 0
  for (const c of text) {
    sum_val += char2code(c)
  }
  return sum_val % 35 === aim_remain
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

export default {
  valid_full_key
}

