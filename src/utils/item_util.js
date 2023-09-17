import moment from "moment/moment"
import config_util from "@/utils/config_util";
import db_util from "@/utils/db_util";
import Assert from "assert-js"

async function addNodeToDB(node) {
  const {id, q, a} = node
  Assert.true(!!id);
  const db_item = {
    _id: id,
    q: q,
    a: a,
    rev_alg: "anki",
    rev_state: "rev",
    rev_learned_at: new Date(),
    rev_next_at: moment().add(1, 'days').toDate(),
    rev_history: []
  }
  if (config_util.isDevelopment) {
    db_item.rev_learned_at = moment().add(-1, 'days').toDate()
    db_item.rev_next_at = new Date()
    console.log("测试模式，调整复习日期", db_item)
  }
  db_util.insertItem(db_item)
}

export default {
  addNodeToDB
}

