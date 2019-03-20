<template>
  <div class= "charts" id="myChartAge" style="height:100%"></div>
</template>
<script>
import { getNlnum } from "@/api/homeDetail";
const textColor = "#909399";
export default {
  data() {
    return {
    };
  },
  props: {
    xzqhCode: String // 接收父组件行政区划编码
  },
  watch: {
    // 监听行政区划编码更新数据
    xzqhCode(val) {
      this.getData(val)
    }
  },
  methods: {
    getData(orgcode) {
      getNlnum({
        orgcode
      }).then((res)=> {
        this.chartInit(res.data.result)
      })
    },
    chartInit(data = {}) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChartAge"));
      let xData = [];
      let yData = [];

      for (const key in data) {
       yData.push(data[key])
      }
      // 指定图表的配置项和数据
      var option = {
          tooltip: {
          trigger: "item",
          backgroundColor: "#fff",
          padding: [10],
          textStyle: {
            color: textColor
          },
          borderColor: "#eee",
          borderWidth: 1,
          position: "right",
          extraCssText: "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);",
          formatter: function(params, ticket, callback) {
            let interval = params.name-10 >=0? `${params.name-10}-${params.name}岁`:"100岁以上"
            return  `<div class="hm-charts-tooltip">
                        <div class="hm-charts-tooltip-header">
                            <span class="hm-charts-tooltip-header-category">
                               年龄段 ${interval}
                            </span>
                        </div>
                        <div class="hm-charts-tooltip-body">
                            <p class="hm-charts-tooltip-item">
                                <span class="hm-charts-tooltip-item-icon" style="color:${params.color}">
                                ● 
                                </span>
                                <span class="hm-charts-tooltip-item-label">数量 ${params.value}</span>
                            </p>
                        </div>
                    </div>`
          }
        },
          xAxis: {
              type: 'category',
              data: ['10', '20', '30', '40', '50', '60', '70', "80", "90", "100", "100以上"],
               axisTick: {show: false},
              axisLine: {
                lineStyle: {
                  color: "#fff"
                }
              }
          },
          yAxis: {
              type: 'value',
               axisLine: {
                lineStyle: {
                  color: "#fff"
                }
              }
          },
          series: [{
              name: "年龄段",
              data: yData,
              type: 'bar',
              itemStyle: {
               
                normal: {
                   color: "#749f83",
								label: {
									show: true, //开启显示
									position: 'top', //在上方显示
									textStyle: { //数值样式
										color: '#fff',
										fontSize: 12
									}
								}
							}
              }
          }]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      window.addEventListener("resize", function(){
         myChart.resize();
      })
    },
  },
  mounted() {
    this.getData();
  }
};
</script>
<style lang="scss" scoped>

</style>

