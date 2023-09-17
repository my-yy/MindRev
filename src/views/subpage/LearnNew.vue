<template>
  <div class="LearnNew" v-if="cur_node">
    <review-topbar :item_list="need_learn_list" :cur_item="cur_node"/>
    <content-render
      style="margin-top: 10px"
      :cur_item="cur_node" :answer_showing="answer_showing"/>

    <div class="bottom_bar_wrapper">
      <el-button style="flex-grow: 1" v-show="!answer_showing" @click="onShowAnswerClick">显示答案</el-button>
      <template v-if="answer_showing">
        <el-button class="btn" @click="onNotRememberClick">生疏</el-button>
        <el-button type="success" class="btn" @click="onMarkAsLearned">记得</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import path from "path";

const map_reader = require("@/utils/map_helper/map_reader")
const db_util = require("@/utils/db_util")
const Assert = require('assert-js')
const moment = require('moment')
import config_util from "@/utils/config_util";
import BackIcon from "@/components/BackIcon";
import ContentRender from "@/components/ContentRender";
import ReviewTopbar from "@/components/ReviewTopbar";

export default {
  name: 'LearnNew',
  components: {BackIcon, ContentRender, ReviewTopbar},
  data() {
    return {
      need_learn_list: [],
      cur_node: null,
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
    basename(full_path) {
      if (!full_path) {
        return
      }
      return path.basename(full_path)
    },
    async onMarkAsLearned() {
      //1.获取当前的index
      const index = this.need_learn_list.indexOf(this.cur_node)
      await this.addNodeToDB(this.cur_node)

      //2.从当前的列表中删除
      this.need_learn_list.splice(index, 1)
      console.log("need_learn_list", this.need_learn_list)

      //3.切换到下一个
      if (index <= this.need_learn_list.length - 1) {//有下一个
        this.showIndexNode(index)
      } else if (index !== 0) {//没有下一个，切换到开头
        this.showIndexNode(0)
      } else {
        this.cur_node = null
        Assert.true(this.need_learn_list.length === 0)//
        //提示
        this.$notify({
          title: '学习已完成',
          message: '已完成所有待学习内容',
          type: 'success'
        });
        this.$router.go(-1)
      }
    },
    async addNodeToDB(node) {
      const {id, q, a} = node
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
    },
    onNotRememberClick() {
      //切换到下一个
      const cur_index = this.need_learn_list.indexOf(this.cur_node)
      //是否有下一个
      if (cur_index < this.need_learn_list.length - 1) {//有下一个
        this.showIndexNode(cur_index + 1)
      } else if (cur_index !== 0) {//没有下一个，从0开始
        this.showIndexNode(0)
      } else {//还是显示现在的
        this.showIndexNode(cur_index)
      }
    },
    showIndexNode(the_index) {
      this.cur_node = this.need_learn_list[the_index]
      this.answer_showing = false
    },
    async init() {
      //1.读取所有节点
      const node_list = await map_reader.getInterestNodeListFromFile(this.the_path)
      console.log("node_list", node_list.length)

      //2.得到new的节点
      const need_learn_list = []
      for (const node of node_list) {
        const item = db_util.getItemById(node.id)
        if (!item) {//数据库中不存在
          need_learn_list.push(node)
        }
      }
      this.need_learn_list = need_learn_list
      this.cur_node = need_learn_list[0]
    },
    onShowAnswerClick() {
      this.answer_showing = true
    }
  },


}
</script>

<style scoped>
.LearnNew {
  display: flex;
  flex-direction: column;
  margin: 5px;
  /*border: 1px red solid;*/
}

.q_part, .a_part {
  white-space: pre-wrap;
}

.qa_wrapper {
  flex-grow: 1;
}

.bottom_bar_wrapper {
  /*border: 1px red solid;*/
  display: flex;
  padding: 10px;
}

.bottom_bar_wrapper > .btn {
  flex-grow: 1;
}


</style>
