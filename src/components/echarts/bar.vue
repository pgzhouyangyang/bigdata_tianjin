<template>
  <div class="charts" :id="chartId" style="height:100%"></div>
</template>
<script>

export default {
  props: {
    chartId: {
      type: String,
      default: "charts"
    }
  },
  data() {
    return {
      myChart: null
    };
  },
  computed: {},
  methods: {
    resize() {
       this.myChart.resize();
    },
    renderChart(opt = {}) {
      // 基于准备好的dom，初始化echarts实例
      this.myChart = this.$echarts.init(document.getElementById(this.chartId));
      // 指定图表的配置项和数据
      var option = {
        grid: {
            top:20
        },
        tooltip: {
          // trigger: "item",
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          backgroundColor: "#fff",
          padding: [10],
          textStyle: {
            color: "#909399"
          },
          borderColor: "#eee",
          borderWidth: 1,
          position: "right",
          extraCssText: "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);",
          formatter: opt.formatter || {}
        },
        xAxis: {
          type: "category",
          data: opt.xData,
          axisTick: { show: false },
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          },
           axisLabel: {
                interval:0 
            }
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          }
        },
        series: [
          {
            name: opt.name,
            data: opt.yData,
            type: "bar",
            itemStyle: {
              normal: {
                color: "#749f83",
                label: {
                  show: true, //开启显示
                  position: "top", //在上方显示
                  textStyle: {
                    //数值样式
                    color: "#fff",
                    fontSize: 12
                  }
                }
              }
            }
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(option);
      window.removeEventListener("resize", this.resize);
      window.addEventListener("resize", this.resize);
    }
  }
};
</script>
<style lang="scss">
</style>
