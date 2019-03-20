<template>
  <div class="charts" id="myChartGender" style="height:100%"></div>
</template>
<script>
import { getGdLx } from "@/api/homeDetail";
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
      getGdLx({
        orgcode
      }).then((res)=> {

        this.chartInit(res.data.result)
      })
      
    },
    chartInit(data = {}) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChartGender"));
      let legend = [];
      let seriesData = []
      for (const key in data) {
        legend.push(key);
        seriesData.push({
          name: key,
          value: data[key]
        })
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
          data: legend,
          textStyle: {
            color: "#fff"
          }
        },
        series: [
          {
            name: "数量",
            type: "pie",
            radius: "60%",
            center: ["50%", "50%"],
            avoidLabelOverlap: false,
            itemStyle: {
               normal:{
                  color:function(params) {
                  //自定义颜色
                  var colorList = [          
                          '#00FFFF', '#749f83', '#FFFF00', '#FF8C00', '#FF0000', '#FE8463',
                      ];
                      return colorList[params.dataIndex]
                    }
              }
            },
            label: {
              formatter: '{b}: {c}'
            },
            // labelLine: {
            //   normal: {
            //     show: false
            //   }
            // },
            data: seriesData
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
  }
};
</script>
<style lang="scss" scoped>

</style>

