import * as echarts from "echarts";

export function getChartOption(xData, yData1) {
  // const xData = ["明天", "2天后", "3天后", "4天后", "5天后", "7天后"]
  // const yData1 = [5, 20, 36, 10, 10, 20]
  // const yData2 = [15, 20, 36, 10, 10, 20] 时间

  const COLOR_TIME = "#96e6a1"
  const COLOR_COUNT = "#188df0"
  const name1 = "待复习数量"
  const name2 = "时间（分钟）"


  const barWidth = 20
  const data1 = {
    name: name1,
    type: 'bar',
    data: yData1,
    barWidth: barWidth,
    itemStyle: {
      normal: {
        color: new echarts.graphic.LinearGradient(
          0, 0, 0, 1,
          [
            {offset: 0, color: '#83bff6'},
            {offset: 0.5, color: '#188df0'},
            {offset: 1, color: COLOR_COUNT}
          ]
        )
      },
    }
  }


  const option = {
    legend: {
      data: [name1, name2],
      textStyle: {
        // color: ["#188df0", "#96e6a1"]
      }
    },
    xAxis: {
      data: xData,
      axisLabel: {
        // textStyle: {
        //   color: '#fff'
        // }
      },
      axisLine: {
        show: false,
        lineStyle: {
          // color: '#ffffff', // 颜色
        }
      },
      axisTick: {
        show: false
      },
    },
    yAxis: {
      axisTick: {
        show: false
      },
      axisLine: {
        show: false,
        lineStyle: {
          // color: '#ffffff', // 颜色
        }
      }
    },
    series: [data1],
    grid: {
      left: '30',
      right: '0',
      // top: '20',
      bottom: '20'
    }
  };
  return option
}
