<template>
  <div class="NodeList">
    <node-list-top-bar @refresh="onRefresh" :the_path="the_path"/>

    <div class="info_text" v-if="needLearnList.length>0">
      <el-link @click="onLearnItem">待学习：{{ needLearnList.length }}项</el-link>
    </div>

    <el-table :data="item_list" style="width: 100%"
              @row-click="onSelectedRowChange"
              @row-contextmenu="onTableContextMenu">
      <el-table-column label="状态" width="100" :formatter="formatterRevState"></el-table-column>
      <el-table-column label="节点" :formatter="formatterQ"></el-table-column>
      <el-table-column label="复习次数" width="100" :formatter="formatterRevCount"></el-table-column>
      <el-table-column label="上次复习" width="100" :formatter="formatterRevLastAt"></el-table-column>
      <el-table-column label="下次复习" width="100" :formatter="formatterRevNetAt"></el-table-column>
    </el-table>
    <div style="text-align: center;font-size: small;margin-top: 3px;">
      合计{{ item_list.length }}项
    </div>
    <dialog-preview ref="dialogPreview"></dialog-preview>
  </div>
</template>

<script>
import NodeListTopBar from "@/components/NodeListTopBar";

const {shell} = require('electron')
const path = require('path')
const map_reader = require("@/utils/map_helper/map_reader")

const db_util = require("@/utils/db_util")
import time_util from "@/utils/time_util";
import rev_util_pjs from "@/utils/rev_util_pjs";
import DialogPreview from "@/components/DialogPreview";
import {getCurrentWindow, Menu, MenuItem} from "@electron/remote";
import item_util from "@/utils/item_util";

export default {
  name: 'NodeList',
  components: {DialogPreview, NodeListTopBar},
  data() {
    return {
      item_list: []
    }
  },
  computed: {
    needLearnList() {
      return this.item_list.filter(item => item.rev_state === "new")
    },
    the_path() {
      return this.$route.query.path
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    onSelectedRowChange(object) {
      this.$refs.dialogPreview.show(object)
    },
    async onRefresh() {
      await this.init()
      this.$message.success("已经刷新")
    },
    formatterQ(item, column_obj) {
      return item.q.title || "（无文字内容）"
    },
    formatterRevState(item, column_obj) {
      const dic = {
        "rev": "复习中",
        "new": "待学习"
      }
      return dic[item.rev_state]
    },
    formatterRevCount(item, column_obj) {
      // console.log(item.rev_history)
      return (item.rev_history || []).length
    },
    formatterRevLastAt(item, column_obj) {
      if (item.rev_state === "new") {
        return "无"
      }
      const date = rev_util_pjs.calc_last_rev_date_obj(item)
      return time_util.date2str(date, true)
    },
    formatterRevNetAt(item, column_obj) {
      if (item.rev_state === "new") {
        return "无"
      }
      return time_util.date2str(item.rev_next_at, true)
    },
    basename(full_path) {
      return path.basename(full_path)
    },

    async init() {
      //1.读取xmind文件
      let obj_list = await map_reader.getInterestNodeListFromFile(this.the_path)
      //3.逐一判断状态
      const item_list = []
      for (const obj of obj_list) {
        console.log("obj", obj)
        let item = db_util.getItemById(obj.id)
        if (!item) {
          item = {
            "_id": obj.id,
            "rev_state": "new",//new、rev
          }
        }
        item["q"] = obj.q
        item["a"] = obj.a
        item["_map_path"] = this.the_path
        item_list.push(item)
      }
      this.item_list = item_list
      console.log("content", obj_list)
    },
    onLearnItem() {
      if (this.needLearnList.length === 0) {
        return
      }
      this.$router.push("/learn?path=" + encodeURIComponent(this.the_path))
    },
    onTableContextMenu(row, column, event) {
      console.log({row, column, event})

      const menu = new Menu()
      const win = getCurrentWindow()

      const SEPARATOR = {
        type: 'separator'
      }
      const item = row
      const isNew = item.rev_state === "new"

      const MarkAsLearned = {
        label: '标记为已学习',
        id: 'id1',
        click: (menuItem, browserWindow) => {
          item.id = item._id//因为下面的那个函数用的是"id"字段
          item_util.addNodeToDB(item)
          //刷新显示
          this.init()
        }
      }

      const MarkAsNew = {
        label: '重置为未学习状态',
        id: 'id2',
        click: (menuItem, browserWindow) => {
          db_util.deleteItemByID(item._id)
          this.init()
        }
      }

      const item_list = [
        isNew ? MarkAsLearned : MarkAsNew
      ]

      item_list.forEach(item => {
        menu.append(new MenuItem(item))
      })
      menu.popup([{window: win, x: event.clientX, y: event.clientY}])
    },

  }
}
</script>

<style scoped>
.NodeList {
  margin: 5px;
}


.info_text {
  font-size: 0.9em;
  margin-top: 10px;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
}

</style>
