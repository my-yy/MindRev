<template>
  <div class="Today">
    <div class="loading_wrapper" v-show="is_loading">
      <i class="el-icon-loading"></i>
    </div>


    <div class="section_wrapper">
      <h1>
        待学习
      </h1>
      <div v-for="obj in haveNewList" style="text-align: center">
        <el-link @click="onLearnNewClick(obj)"> {{ obj.mind_map_name }}：{{ obj.item_list.length }}项待学习</el-link>
      </div>
      <div v-if="totalNeedLearnItemLength===0" class="no_content">
        无待学习内容
      </div>
    </div>


    <div class="section_wrapper">
      <h1>今日复习</h1>
      <div class="wrapper1" v-if="todayNeedRevList.length>0">
        <div>
          今日待复习：{{ todayNeedRevList.length }} 项
        </div>
        <el-button @click="onToRevClick">开始复习</el-button>
      </div>
      <div v-else class="no_content">
        无复习内容
      </div>
    </div>


    <div class="section_wrapper">
      <h1>未来</h1>
      <future-chart v-show="future_list.length>0" ref="futureChart"></future-chart>
      <div class="no_content" v-show="future_list.length===0">无复习内容</div>
    </div>


  </div>
</template>

<script>
import eventbus from "@/utils/eventbus";

const db_util = require("@/utils/db_util")
const map_reader = require("@/utils/map_helper/map_reader")
const fs = require("fs")
const path = require("path")
import time_util from "@/utils/time_util";
import FutureChart from "@/components/charts/FutureChart";

export default {
  name: 'Today',
  components: {FutureChart},
  data() {
    return {
      todayNeedRevList: [],
      haveNewList: [],
      future_list: [],
      is_loading: true,
    }
  },
  computed: {
    totalNeedLearnItemLength() {
      const arr = this.haveNewList.map(obj => obj.item_list.length)
      const sum = arr.reduce((partialSum, a) => partialSum + a, 0);
      return sum

    }
  },
  async mounted() {
    this.is_loading = true
    try {
      await this.init()
    } catch (e) {
      console.log(e)
      this.$message.error("加载遇到错误:" + e)
      setTimeout(() => {
        throw e
      }, 1000)
    }
    this.is_loading = false
    eventbus.bus.$on("navi_bar:refresh_click", this.doRefresh)
  },
  beforeDestroy() {
    eventbus.bus.$off("navi_bar:refresh_click", this.doRefresh)
  },
  methods: {
    async doRefresh() {
      await this.init()
      this.$message({
        "type": "success",
        "duration": 500,
        "message": "已刷新"
      })
    },
    onLearnNewClick(obj) {
      const mind_map_path = obj.mind_map_path
      //进入学习页面
      this.$router.push("/learn?path=" + encodeURIComponent(mind_map_path))


    },
    async init() {
      //1.找到今天要复习的内容列表
      const todayNeedRevList = []


      //1.找到所有的mindmap
      const all_maps = await db_util.getMapCollection().find({})
      const todayEnd = time_util.dateEnd(new Date())
      const date2items = {}
      for (const map_obj of all_maps) {
        if (!fs.existsSync(map_obj.path)) {
          continue
        }
        const new_item_list = []
        //2.读取node列表
        const nodes = await map_reader.getInterestNodeListFromFile(map_obj.path)
        //3.过滤得到今天要复习的内容
        for (const node of nodes) {
          //4.查询数据库
          const item = db_util.getItemById(node.id)
          if (!item) {//数据库中不存在
            node._map_path = map_obj.path
            new_item_list.push(node)
            continue
          }
          // console.log("item", item, item.rev_next_at < todayEnd)
          //内容补充
          item["q"] = node.q
          item["a"] = node.a
          item["_map_path"] = map_obj.path
          //5.查看是否需要复习
          if (item.rev_next_at < todayEnd) {
            todayNeedRevList.push(item)
          }
          //6.day2item
          const day_str = time_util.date2str(item.rev_next_at, true)
          const tmp_arr = date2items[day_str] || []
          tmp_arr.push(item)
          date2items[day_str] = tmp_arr


        }
        //待学习项目
        if (new_item_list.length > 0) {
          this.haveNewList.push({
            "mind_map_path": map_obj.path,
            "mind_map_name": path.basename(map_obj.path),
            "item_list": new_item_list,
          })
        }

      }

      this.todayNeedRevList = todayNeedRevList
      this.displayChart(date2items)
    },
    displayChart(date2items) {
      //未来的num次
      const todayEnd = time_util.dateEnd(new Date())
      const num = 5
      let date_list = Object.keys(date2items).map(date_str => time_util.str2date(date_str, true))
      console.log("date_list", date_list)
      //从小到大排序
      date_list = date_list.sort((a, b) => a - b)
      //比今天要大的
      date_list = date_list.filter(date => date > todayEnd)
      const max_len = Math.min(num, date_list.length)
      const future_list = []
      for (let i = 0; i < max_len; i++) {
        const future_date = date_list[i]
        const items = date2items[time_util.date2str(future_date, true)] || []
        future_list.push({
          span: time_util.getDayDiff_tz(future_date, new Date()),
          date: future_date,
          items: items
        })
      }
      this.future_list = future_list

      const xData = future_list.map(obj => obj.span + "天后")
      const yData = future_list.map(obj => obj.items.length)
      // console.log(xData)
      // console.log(yData)
      this.$refs.futureChart.show(xData, yData)
    },
    onToRevClick() {
      //1.router
      localStorage.setItem("today_rev", JSON.stringify(this.todayNeedRevList))
      this.$router.push("/review")


    }

  },


}
</script>

<style scoped>
.Today {
  margin: 5px;
  /*border: 1px red solid;*/
}

.section_wrapper {
  margin-bottom: 3em;
}

.wrapper1 {
  text-align: center;
}

.no_content {
  text-align: center;
  color: gray;
}

.loading_wrapper {
  text-align: center;
  margin-top: 30vh;
  font-size: 1em;
}

</style>
