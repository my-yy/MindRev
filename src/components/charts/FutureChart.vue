<template>
  <div class="FutureChart">
    <div id="echart_statics_bar"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import {getChartOption} from "@/components/charts/barchart_config"

export default {
  name: 'FutureChart',
  components: {},

  data() {
    return {}
  },
  mounted() {
    this.barchart = echarts.init(document.getElementById("echart_statics_bar"))
    this.barchart.on('click', this.onBarChartClick);
    this.showDemo()
    window.addEventListener("resize", this.onWindowResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onWindowResize);
  },
  methods: {
    showDemo() {
      const xData = ["明天", "2天后", "3天后", "4天后", "5天后", "7天后"]
      const yData1 = [5, 20, 36, 10, 10, 20]
      const yData2 = [15, 20, 36, 10, 10, 20] //时间
      const option = getChartOption(xData, yData1, yData2)
      this.barchart.setOption(option, true);
    },
    show(xData, yData1) {
      const option = getChartOption(xData, yData1)
      this.barchart.setOption(option, true);
    },
    onBarChartClick(obj) {
      const dataIndex = obj.dataIndex
      // 计算日期
      // const date = time_util.addDays(new Date(), 1 + dataIndex)
      // const datestr = time_util.formatYMD(date)
      // this.$router.push("/revfuture/" + datestr);
    },
    onWindowResize() {
      console.log("onWindowResize")
      this.barchart.resize()
    }
  },
}
</script>

<style scoped>

#echart_statics_bar {
  /*border: 1px red solid;*/
  width: calc(100vw - 100px);
  height: 200px;
}

</style>
