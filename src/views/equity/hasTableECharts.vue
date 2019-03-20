<template>
  <div class="charts-box">
    <div class="charts" :id="chartId" v-show="clickNum == 0" style="height:100%"></div>
    <div v-show="clickNum >0" class="tableList charts">
      <el-scrollbar class="page-component__scroll" style="height:100%">
        <table width="100%">
          <thead>
            <tr>
              <th width="30%">行政区别</th>
              <th width="30%">数量</th>
              <th width="50%">占比</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in chartsData" :key="index">
              <!-- <td>{{index+1}}</td>
              <td>{{item.orgcode}}</td>
              <td>{{item.orgname}}</td>-->
              <td>{{item.orgname}}</td>
              <td>{{item.sum}}</td>
              <td>
                <el-progress :percentage="computedPer(item.sum)"></el-progress>
              </td>
            </tr>
            <tr v-if="chartsData && !chartsData.length">
              <td colspan="3">
                <div class="empty">暂无统计数据</div>
              </td>
            </tr>
          </tbody>
        </table>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import { getGfSum } from "@/api/homeDetail";
import { Progress } from "element-ui";
const textColor = "#909399";
export default {
  data() {
    return {
      // xzqhCode: "", // 行政区划编码
      clickNum: 0, // 行政区划层级
      total: 0,
      chartsData: []
    };
  },
  props: {
    echarObj: Object,
    xzqhCode: String
  },
   computed: {
    chartId() {
      return "id-" + Date.now();
    }
  },
  watch: {
    echarObj: {
      handler: function(val) {
        this.orgcode = val.orgcode;
        this.clickNum = val.clickNum;
        this.getData(val.orgcode)
      },
      deep: true
    },
  },
  components: {
    Progress
  },
  methods: {
   getData(orgcode) {
      this.chartsData = []
      getGfSum({
        orgcode
      }).then((res)=> {
        this.chartsData = res.data.result;
        this.chartInit(res.data.result);
        let total = 0;
        this.chartsData.forEach((item)=> {
          total+=item.sum
        })
        this.total = total;
      })
    },
    // 计算人员占比
    computedPer(count) {
      if (this.total > 0) {
        return parseInt(count / this.total * 100);
      }
      return 0;
    },
    chartInit(chartData = []) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(
        document.getElementById(`${this.chartId}`)
      );
      let data = [];
      let legend = [];
      chartData.forEach(item => {
        data.push({
          name: item.orgname,
          value: item.sum
        });
      });
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
          series: [
            {
              name: "股份经济合作社",
              type: "pie",
              radius: "60%",
              center: ["50%", "50%"],
              data: data,
              label: {
                 formatter: '{b}: {c}'
              },
              itemStyle: {
                emphasis: {
                  borderWidth: 0,
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                },
                normal: {
                  color: function(params) {
                    //自定义颜色
                    var colorList = [
                      "#00FFFF",
                      "#749f83",
                      "#FFFF00",
                      "#FF8C00",
                      "#FF0000",
                      "#FE8463"
                    ];
                    return colorList[params.dataIndex];
                  }
                }
              }
            }
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize", function() {
          myChart.resize();
        });
    }
  },
  mounted() {
    // this.chartInit();
  }
};
</script>
<style lang="scss" scoped>
.charts-box {
  width: 100%;
  height: 100%;
}
.tableList {
  height: 100%;
  overflow: hidden;
  position: relative;
  table {
    border-collapse: collapse;
    width: 100%;
    border-color: #5487c8;
    padding-top: 3vh;
    thead {
      width: 100%;
      tr {
        width: 100%;
        color: #fff;
        background-color: #263770;
        font-size: 0.8vw;
      }
    }
    tbody {
      tr {
        color: #78dcfd;
        font-size: 0.8vw;
        height: 3vh;
        text-align: center;
        width: 100%;
        table-layout: fixed;
        font-weight: 100;
      }
    }
    .tfoot {
      color: #ffd200;
    }
  }
  th,
  td {
    border: 1px solid #385793;
  }
}
.empty {
  padding: 10px 0;
}

</style>
<style  lang="scss">
.tableList .el-progress__text {
  color: #fff
}
.page-component__scroll {
  height: 100%;
  .page-component__scroll .el-scrollbar__wrap {
    overflow: auto;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden !important;
  }
}
</style>

