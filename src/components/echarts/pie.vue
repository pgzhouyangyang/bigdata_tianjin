<template>
  <div class="charts" :id="chartId" style="height:100%"></div>
</template>
<script>
export default {
  props: {
    chartId: String
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
      console.log()
      var option = {
        color: opt.color && opt.color.length?opt.color : [
          "#00FFFF",
          "#749f83",
          "#FFFF00",
          "#FF8C00",
          "#FF0000",
          "#FE8463"
        ],
        tooltip: {
          trigger: "item",
          backgroundColor: "#fff",
          padding: [10],
          textStyle: {
            color: "#909399"
          },
          borderColor: "#eee",
          borderWidth: 1,
          extraCssText: "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);",
          formatter: function(params, ticket, callback) {
            return `<div class="hm-charts-tooltip">
                <div class="hm-charts-tooltip-header">
                    <span class="hm-charts-tooltip-header-category">
                        ${params.name}
                    </span>
                </div>
                <div class="hm-charts-tooltip-body">
                    <p class="hm-charts-tooltip-item">
                        <span class="hm-charts-tooltip-item-icon" style="color:${
                          params.color
                        }">
                        ● 
                        </span>
                        <span class="hm-charts-tooltip-item-label"> ${
                          params.seriesName
                        }</span>
                        <span class="hm-charts-tooltip-item-value">${
                          params.value
                        }(${params.percent}%)</span>
                    </p>
                </div>
            </div>`;
          }
        },
        legend: opt.legend || {},
        series: [
          {
            name: opt.name,
            type: "pie",
            radius: opt.radius || "60%",
            center: ["50%", "50%"],
            data:
              opt.data && opt.data.length
                ? opt.data
                : [{ name: "暂无统计数据", value: 0 }],
            label: {
             
              ...opt.label
            },
            avoidLabelOverlap: false,
            itemStyle: {
              emphasis: {
                borderWidth: 0,
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
              // normal: {
              //   color: function(params) {
              //     //自定义颜色
              //     var colorList = [
              //       "#00FFFF",
              //       "#749f83",
              //       "#FFFF00",
              //       "#FF8C00",
              //       "#FF0000",
              //       "#FE8463"
              //     ];
              //     return colorList[params.dataIndex];
              //   }
              // }
            }
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(option);
      window.removeEventListener("resize", this.resize)
      window.addEventListener("resize", this.resize);
    }
  }
};
</script>
<style lang="scss">
</style>
