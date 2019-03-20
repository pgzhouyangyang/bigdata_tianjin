<template>
  <div class="charts" id="myChartNation" style="height:100%"></div>
</template>
<script>
import { getMznum } from "@/api/homeDetail";
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
      getMznum({
        orgcode
      }).then((res)=> {
        this.chartInit(res.data.result)
      })
      
    },
    chartInit(data = []) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChartNation"));
      let xData = [];
      let legend = []
      data.forEach((item)=> {
        xData.push({
          name: item.name,
          value: item.sum
        });
        legend.push(item.name)
      })
      // 指定图表的配置项和数据
      var option = {
        color: legend.length?['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']:'#749f83',
        tooltip: {
          trigger: "item",
          backgroundColor: "#fff",
          padding: [10],
          textStyle: {
            color: textColor
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
        legend: {
          orient: "vertical",
          type: 'scroll',
          x: "right",
          data:  legend.length?xData: ["暂无统计数据"],
          textStyle: {
            color: "#fff"
          }
        },
        series: [
          {
            name: "数量",
            type: "pie",
            // radius: ["50%", "60%"],
             center: ["45%", "50%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              // emphasis: {
              //   show: true,
              //   textStyle: {
              //     fontSize: "16",
              //     fontWeight: "bold"
              //   }
              // }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: xData.length?xData: [{name: "暂无统计数据", value: 0}]
          }
        ]
        
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
       window.addEventListener("resize", function(){
         myChart.resize();
      })
     
    },
  },
  mounted() {
    // this.getData();
  }
};
</script>
<style lang="scss">

</style>

