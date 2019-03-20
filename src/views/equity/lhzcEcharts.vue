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
import { getLhzczeSum } from "@/api/homeDetail";
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
      getLhzczeSum({
        orgcode
      }).then((res)=> {
        console.log(res)
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
     chartInit(data = []) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById(`${this.chartId}`));
      let xData = [];
      let yData = [];
      data.forEach((item)=> {
        xData.push(item.orgname);
        yData.push(item.sum)
      })
      // 指定图表的配置项和数据
      var option = {
        grid :{
          top: 10,
          bottom: 30
        },
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
          // formatter: function(params, ticket, callback) {
          //   let interval = params.name-10 >=0? `${params.name-10}-${params.name}岁`:"100岁以上"
          //   return  `<div class="hm-charts-tooltip">
          //               <div class="hm-charts-tooltip-header">
          //                   <span class="hm-charts-tooltip-header-category">
          //                      年龄段 ${interval}
          //                   </span>
          //               </div>
          //               <div class="hm-charts-tooltip-body">
          //                   <p class="hm-charts-tooltip-item">
          //                       <span class="hm-charts-tooltip-item-icon" style="color:${params.color}">
          //                       ● 
          //                       </span>
          //                       <span class="hm-charts-tooltip-item-label">数量 ${params.value}</span>
          //                   </p>
          //               </div>
          //           </div>`
          // }
        },
          xAxis: {
              type: 'category',
              data: xData,
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
              name: "量化资产总额",
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

