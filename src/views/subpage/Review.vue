<template>
  <div class="Review" v-if="cur_item">
    <review-topbar :item_list="item_list" :cur_item="cur_item"/>
    <content-render
      style="margin-top: 10px"
      :cur_item="cur_item" :answer_showing="answer_showing"/>
    <div class="bottom_bar">
      <el-button class="btn" v-show="!answer_showing" @click="onShowAnswerClick">显示答案</el-button>
      <mark-bar class="markbar1" @mark="onMark" :item="cur_item" :show_it="answer_showing"/>
    </div>
  </div>
</template>

<script>
import path from "path";

const moment = require('moment')
const json_util = require('@/utils/json_util')
import MarkBar from "@/components/MarkBar";
import BackIcon from "@/components/BackIcon";
import IconBtn from "@/components/IconBtn";
import ReviewTopbar from "@/components/ReviewTopbar";
import ContentRender from "@/components/ContentRender";

export default {
  name: 'Review',
  components: {MarkBar, BackIcon, IconBtn, ReviewTopbar, ContentRender},
  data() {
    return {
      item_list: [],
      cur_item: null,
      answer_showing: false
    }
  },
  computed: {
    the_path() {
      return this.$route.query.path
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      //1.读取所有节点
      const item_list = JSON.parse(localStorage.getItem("today_rev"), json_util.dateTransformer)
      this.item_list = item_list
      this.cur_item = item_list[0]
    },
    basename(full_path) {
      if (!full_path) {
        return
      }
      return path.basename(full_path)
    },
    onMark() {
      console.log("onMark")
      //切换到下一个
      const cur_index = this.item_list.indexOf(this.cur_item)
      //是否有下一个
      if (cur_index < this.item_list.length - 1) {//有下一个
        this.showIndexNode(cur_index + 1)
      } else {//没有下一个
        this.$notify({
          title: '复习完成',
          message: '已完成今日复习',
          type: 'success'
        });
        this.$router.go(-1)
      }
    },
    showIndexNode(the_index) {
      this.cur_item = this.item_list[the_index]
      this.answer_showing = false
    },
    onShowAnswerClick() {
      this.answer_showing = true
    }
  },


}
</script>

<style scoped>
.Review {
  margin: 5px;
  display: flex;
  flex-direction: column;
  /*border: 1px red solid;*/
}


.bottom_bar {
  /*border: 1px red solid;*/
  display: flex;
  margin: 10px;
}

.bottom_bar > .btn {
  flex-grow: 1;
}

.markbar1 {
  flex-grow: 1;
}


</style>
