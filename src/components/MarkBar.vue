<template>
  <div class="MarkBar" v-if="showMarkBar">
    <mark-btn class="mark_btn1"
              v-for="(op,idx) in options"
              :obj="op"
              @click="op.onMark(op)">
    </mark-btn>
  </div>
</template>

<script>
import time_util from "@/utils/time_util";
import Assert from "assert-js";
import rev_util_pjs from "@/utils/rev_util_pjs";
import alg_util from "@/utils/anki_util";
// import item_util from "@/utils/item_util";
import MarkBtn from "@/components/MarkBtn";

const db_util = require("@/utils/db_util")

export default {
  name: 'MarkBar',
  props: ["item", "show_it"],
  components: {MarkBtn},
  data() {
    return {
      options: []
    }
  },
  watch: {
    item: {
      immediate: true,
      handler(new_v, old_v) {
        console.log("watch")
        this.init()
      }
    },
  },
  computed: {
    showMarkBar() {
      // return true
      // return !!this.item
      return this.show_it && this.item && this.item.rev_state === "rev"
    }
  },
  methods: {
    init() {
      if (!this.item) {
        return
      }
      Assert.equal(this.item.rev_alg, "anki")
      const options = this.getAnkiOptions()
      this.options = options
      console.log("options", options)
    },
    getAnkiOptions() {
      console.log("getAnkiOptions")
      const item = this.item

      //1.获得距离上次复习的时间跨度
      let lastRevAt = rev_util_pjs.calc_last_rev_date_obj(item)
      console.log("lastRevAt", lastRevAt)
      const current_span = (new Date().getTime() - lastRevAt.getTime()) / time_util.ONE_DAY_MS

      //2.获得所有的选项
      const rev_history = item.rev_history || []
      const history_list = rev_history.map(obj => [obj.span, obj.mark])
      const options = alg_util.next_span_batch(history_list, current_span)
      const option_list = []
      const name_list = ["🤪 忘记", "😃 记得", "🤗 熟悉"]
      const color_list = ["#cdb4db", "#a2d2ff", "#a7c957"]
      for (let i = 0; i < options.length; i++) {
        const obj = {
          mark: i,
          this_span: current_span,
          next_span: options[i],
          name: name_list[i],
          color: color_list[i],
          onMark: this.handleAnkMark
        }
        option_list.push(obj)
      }
      console.log("option_list", option_list)
      return option_list
    },
    async handleAnkMark(op) {
      const {mark, this_span, next_span} = op
      const item = this.item

      //添加新记录:history、rev_next_at
      const rev_next_at = time_util.todayAddDays(next_span)
      const hist_obj = {
        span: this_span,
        mark: mark,
        time: new Date()
      }
      item.rev_next_at = rev_next_at
      if (!item.rev_history) {
        item.rev_history = []
      }
      item.rev_history.push(hist_obj)

      console.log(`新增复习记录，mark:${mark},本次间隔${this_span.toFixed(2)},下次间隔:${next_span.toFixed(2)},下次日期:${rev_next_at}}`)
      db_util.updateItem(item)

      //4.提示切换到下一个
      this.$emit("mark")
    },
  },
}
</script>
<style scoped>
.MarkBar {
  /*margin-top: 10px;*/
  /*margin-bottom: 20px;*/
  display: flex;
}

.mark_btn1 {
  flex-grow: 1;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
