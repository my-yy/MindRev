const ReviewResponse = {
  Easy: 2,
  Good: 1,
  Hard: 0,
}


function next_span_batch(history_span_mark_list, current_span) {
  const span_list = history_span_mark_list.map(arr => arr[0])
  span_list.push(current_span)
  const result = []
  for (const mark_value of [0, 1, 2]) {
    const mark_list = history_span_mark_list.map(arr => arr[1])
    mark_list.push(mark_value)
    result.push(next_span_single(span_list, mark_list))
  }
  // console.log(result)
  return result
}


function next_span_single(span_list, mark_list) {
  //初始化easy定义为2.0
  let ease = 2.0
  let result_span
  for (let i = 0; i < span_list.length; i++) {
    const span_real = span_list[i]
    const mark = mark_list[i]
    const obj = update_ease_and_get_next_interval(mark, span_real, ease)
    //更新ease
    ease = obj.ease
    result_span = obj.interval
  }
  // console.log("result_span", {span_list, mark_list, result_span})
  return result_span
}


function update_ease_and_get_next_interval(mark, real_interval, ease) {
  let interval
  if (mark === ReviewResponse.Easy) {
    //easy, the ease increases by 0.2 and the interval changes to old_interval * new_ease * 1.3 (the 1.3 is the easy bonus)
    ease += 0.2;
    ease = Math.min(2.5, ease)
    interval = real_interval * ease * 1.3;

  } else if (mark === ReviewResponse.Good) {
    //good, the ease remains unchanged and the interval changes to old_interval * old_ease
    interval = real_interval * ease;
  } else if (mark === ReviewResponse.Hard) {
    //hard, the ease decreases by 0.2 and the interval changes to old_interval * 0.5
    ease = ease - 0.2
    ease = Math.max(1.3, ease);
    interval = real_interval * 0.5;
  } else {
    throw new Error("Error Mark:" + mark)
  }
  interval = Math.min(interval, 4 * 365); //最大4年
  interval = Math.max(interval, 1); //最小1天
  return {interval, ease};
}

export default {
  next_span_batch
}
