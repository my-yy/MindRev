<template>
  <div class="InfoBtn">
    <el-popover placement="left" trigger="click">
      <div style="display: flex;flex-direction: column;">
        <div>
          <el-link @click="onOpenFile">{{ basename(item._map_path) }}</el-link>
        </div>
        <template v-if="!isNewState">
          <div>复习次数：{{ revCount }}</div>
          <div v-if="revCount===0">学习日期：{{ lastRev }}</div>
          <div v-else>上次复习：{{ lastRev }}</div>
          <div>下次复习：{{ nextAt }}</div>
        </template>
        <div v-else style="width: 10em;">
          该条目为"待学习"状态；标记"记得"会开始复习流程，第一次复习安排在明天
        </div>

        <!--        <div>{{ item }}</div>-->

      </div>
      <icon-btn icon="el-icon-more" slot="reference"/>
    </el-popover>

  </div>
</template>

<script>
import IconBtn from "@/components/IconBtn";
import {shell} from "electron";
import path from "path";
import rev_util_pjs from "@/utils/rev_util_pjs";
import time_util from "@/utils/time_util";
import system_util from "@/utils/system_util";

export default {
  name: 'InfoBtn',
  components: {IconBtn},
  props: ["item"],
  computed: {
    isNewState() {
      if (this.item) {
        return !this.item.rev_state || this.item.rev_state === "new"
      }
      return false
    },
    revCount() {
      if (!this.item) {
        return -1
      }
      return (this.item.rev_history || []).length
    },
    lastRev() {
      const item = this.item
      if (!item || item.rev_state === "new") {
        return "无"
      }
      const date = rev_util_pjs.calc_last_rev_date_obj(item)
      return time_util.date2str(date, true)
    },
    nextAt() {
      const item = this.item
      if (!item || item.rev_state === "new") {
        return "无"
      }
      return time_util.date2str(item.rev_next_at, true)
    },
  },
  methods: {
    onOpenFile() {
      system_util.openFile(this.item._map_path)
    },
    basename(full_path) {
      if (!full_path) {
        return
      }
      return path.basename(full_path)
    },
  },
  data() {
    return {}
  }

}
</script>

<style scoped>


</style>
