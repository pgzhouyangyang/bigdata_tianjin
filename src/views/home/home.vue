<template>
  <div class="home">
    <div class="homeTit">
      <img src="../../assets/titPic.png" alt>
    </div>
    <div class="homeLeft fl">
      <div class="LeftBox">
        <h3>成员数量统计</h3>
        <div class="conEcharts">
          <echarts1 ref="memberChart" v-show="clickNum == 0" chartId="memberChart"></echarts1>
          <echarts-table :dataList="xzqhArr" v-show="clickNum > 0"></echarts-table>
        </div>
      </div>
      <div class="LeftBox">
        <h3>年龄分布统计</h3>
        <div class="conEcharts">
          <echarts2 ref="ageChart" chartId="ageChart"></echarts2>
        </div>
      </div>
    </div>
    <div class="homeCenter fl">
      <div class="centerTop">
        <div class="dhMb">
          <p
            v-for="(item,index) in dhmbArr"
            :key="index"
            @click="dhMbClick(item,index)"
          >{{index==dhmbArr.length-1?item.name:item.name+">>"}}</p>
        </div>
        <div v-show="clickNum==0" class="mapEcharts" id="myChartMap"></div>
        <div v-show="clickNum>0" class="mapEcharts xzqhList">
          <el-scrollbar class="page-component__scroll" style="height:100%">
            <table>
              <thead>
                <tr>
                  <th width="8%">序号</th>
                  <th width="15%">行政编码</th>
                  <th width="15%">行政区划</th>
                  <th width="15%" v-if="clickNum != 2">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in xzqhArr" :key="index">
                  <td>{{index+1}}</td>
                  <td>{{item.orgcode}}</td>
                  <td>{{item.orgname}}</td>
                  <td v-if="clickNum != 2">
                    <el-button size="mini" type="primary" @click="seeClick(item)">查看</el-button>
                  </td>
                </tr>
                <tr v-if="xzqhArr && !xzqhArr.length">
                  <td colspan="4">
                    <div class="empty">暂无统计数据</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <div class="homeRight fl">
      <div class="rightBox">
        <h3>民族分析统计</h3>
        <div class="conEcharts">
          <echarts1 ref="nationChart" chartId="nationChart"></echarts1>
        </div>
      </div>
      <div class="rightBox">
        <h3>性别分析统计</h3>
        <div class="conEcharts">
          <echarts1 ref="genderChart" chartId="genderChart"></echarts1>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Echarts1 from "../../components/echarts/pie";
import EchartsTable from "../../components/echarts/table";
import Echarts2 from "../../components/echarts/bar";
import tianjJs from "../../../static/tianj";

import {
  dzQuery,
  getRynum,
  getSexnum,
  getNlnum,
  getMznum
} from "@/api/homeDetail";
export default {
  components: {
    Echarts1,
    Echarts2,
    EchartsTable
  },
  data() {
    return {
      dhmbArr: [],
      clickNum: 0,
      xzqhArr: [],
      orgcode: ""
    };
  },
  created() {
    document.title = "成员管理大数据指挥仓"
  },
  methods: {
    init() {
      this.ryNumEchart();
      this.sexNumEchart();
      this.nlNumEchart();
      this.mzNumEchart();
    },
    // 成员分析
    async ryNumEchart() {
      this.xzqhArr = [];
      let result = await getRynum({
        orgcode: this.dhmbArr[this.clickNum].value
      });
      this.xzqhArr = result.data.result;
      if (this.clickNum > 0) return;
      let data = [];
      let legend = [];
      this.xzqhArr.forEach(item => {
        data.push({
          name: item.orgname,
          value: item.sum
        });
        legend.push(item.orgname);
      });
      this.$refs.memberChart.renderChart({
        name: "成员管理",
        data: data,
        legend: {
          show: false
        },
        label: {
          normal: {
            formatter: "{b}: {c}"
          }
        }
      });
    },
    // 年龄统计
    async nlNumEchart() {
      let result = await getNlnum({
        orgcode: this.dhmbArr[this.clickNum].value
      });
      let xData = ["10","20", "30", "40", "50","60", "70", "80","90","100","100以上"];
      let yData = [];
      const obj = ["0-10","11-20","21-30","31-40", "41-50", "51-60", "61-70", "71-80", "81-90", "91-100", ">100"];
      obj.forEach((item)=> {
        const sum = result.data.result[item] || 0
        yData.push(sum)
      })
      this.$refs.ageChart.renderChart({
        name: "数量",
        xData,
        yData,
        formatter: function(params, ticket, callback) {
          let interval = params[0].name - 10 >= 0 ? `${params[0].name - 10}-${params[0].name}岁` : "100岁以上";
          return `<div class="hm-charts-tooltip">
                        <div class="hm-charts-tooltip-header">
                            <span class="hm-charts-tooltip-header-category">
                               年龄段 ${interval}
                            </span>
                        </div>
                        <div class="hm-charts-tooltip-body">
                            <p class="hm-charts-tooltip-item">
                                <span class="hm-charts-tooltip-item-icon" style="color:${
                                  params[0].color
                                }">
                                ● 
                                </span>
                                <span class="hm-charts-tooltip-item-label">数量 ${
                                  params[0].value
                                }</span>
                            </p>
                        </div>
                    </div>`;
        }
      });
    },
    // 性别统计
    async sexNumEchart() {
      let result = await getSexnum({
        orgcode: this.dhmbArr[this.clickNum].value
      });
      let legend = [];
      let data = [];
      for (const key in result.data.result) {
        legend.push(key);
        data.push({
          name: key,
          value: result.data.result[key]
        });
      }
      this.$refs.genderChart.renderChart({
        name: "数量",
        data: data,
        legend: {
          orient: "vertical",
          type: "scroll",
          x: "right",
          data: ["男", "女"],
          textStyle: {
            color: "#fff"
          }
        },
        label: {
          normal: {
            formatter: "{b}: {c}"
          }
        }
      });
    },
    // 民族统计
    async mzNumEchart() {
      let result = await getMznum({
        orgcode: this.dhmbArr[this.clickNum].value
      });
      let data = [];
      let legend = [];
      result.data.result.forEach(item => {
        data.push({
          name: item.name,
          value: item.sum
        });
        legend.push(item.name);
      });
     
      this.$refs.nationChart.renderChart({
        color: legend.length //   ['#acb96f', '#e7be71', '#869588', '#98d186', '#c84a76', '#2a89bc', '#a6c19a', '#abc37b', '#ef7d7d']
          ? [
              "#61a0a8",
              "#00FFFF",
             "#d48265",
              "#91c7ae",
             "#ca8622",
              "#546570",
              "#c4ccd3",
              "#FF8C00",
              "#FF0000",
              "#FE8463",
               "#c23531",
              "#2f4554",
              "#bda29a",
              "#6e7074",
              "#749f83",
             "#18d9ea", 
             "#ffd200", 
             "#8ec12a",
              "#749f83",
              "#FFFF00",
            
            ]
          : "#749f83",
        name: "数量",
        data: data,
        radius: ["50%", "60%"],
        legend: {
          orient: "vertical",
          type: "scroll",
          x: "right",
          data: legend.length ? legend : ["暂无统计数据"],
          textStyle: {
            color: "#fff"
          }

          // tooltip: {
          //     show: true,
          //     position: "top",
          //      trigger: "item",
          // backgroundColor: "#fff",
          // padding: [10],
          // textStyle: {
          //   color: "#909399"
          // },
          // borderColor: "#eee",
          // borderWidth: 1,
          // extraCssText: "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);",
          //     formatter: function(params) {
          //       const current = data.find((item)=>{
          //         return item.name == params.name
          //       });
          //       console.log()
          //       if(current) {
          //         return params.name + " " + current.value

          //       }
          //     },
          // }
        },
        label: {
          position: "center",
          show: false,
          emphasis: {
            formatter: '{b}: {c} \n {d} %',
            show: true,
            textStyle: {
              fontSize: "15",
              fontWeight: "bold",
            }
          }
        }
      });
    },
    dhMbClick(item, index) {
      if (item.value.length < this.getCookie("orgcode").length) {
        return;
      }
      this.clickNum = index;
      this.orgcode = item.value;

      this.dhmbArr.splice(index + 1);
      this.init();
    },
    // 生成区划地图
    drawLine() {
      let _this = this;
      let dataArr = require("../../../static/yjs.json");
      let arr = [];
      dataArr.features.map(i => {
        arr.push({ name: i.properties.name, value: i.id });
      });
      var mapOption = {
        geo: {
          map: "tianj"
        },
        layoutCenter: ["50%", "50%"],
        layoutSize: "100%",
        series: [
          {
            type: "map",
            mapType: "tianj",
            label: {
              show: true,
              color: "#fff"
            },
            itemStyle: {
              normal: {
                areaColor: "#18192a",
                borderColor: "#5076cb"
              },
              emphasis: {
                areaColor: "#2ea564"
              }
            },
            data: arr
          }
        ]
      };
      var myChartMap = this.$echarts.init(
        document.getElementById("myChartMap")
      );
      myChartMap.setOption(mapOption);
      myChartMap.on("click", function(params) {
        _this.clickNum++;
        _this.dhmbArr.push({
          name: params.data.name,
          value: params.data.value
        });
        _this.orgcode = params.data.value;

        _this.init();
      });
      window.addEventListener("resize", function() {
        myChartMap.resize();
      });
    },
    // 查看行政区划
    seeClick(row) {
      if (this.clickNum == 2) {
        return;
      }
      this.clickNum++;
      this.dhmbArr.push({
        name: row.orgname,
        value: row.orgcode
      });
      this.orgcode = row.orgcode;
      this.init();
    },
    getCookie(c_name) {
      let c_start = "";
      let c_end = "";
      if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
          c_start = c_start + c_name.length + 1;
          c_end = document.cookie.indexOf(";", c_start);
          if (c_end == -1) c_end = document.cookie.length;
          return unescape(document.cookie.substring(c_start, c_end));
        }
      }
      return "";
    },
    async dzSelect(orgcode) {
      let res = await dzQuery({ orgcode });
      let data = res.data;
      if (data.result && data.result.length) {
        data.result.map(i => {
          if (i.orglevel != 2) {
            this.dhmbArr.push({
              name: i.orgname,
              value: i.orgcode
            });
          }
        });
        this.init();
      }
    }
  },
  mounted() {
    // 根据cookie判断账户级别
    let clickNum = 0;
    let orgcode = this.getCookie("orgcode");
    if (orgcode.length == 2) {
      clickNum = 0;
    } else if (orgcode.length == 6) {
      clickNum = 1;
    } else if (orgcode.length == 9) {
      clickNum = 2;
    }
    this.clickNum = clickNum;
    this.orgcode = orgcode;
    this.dzSelect(orgcode);
    this.drawLine();
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/style/cg.scss";
</style>

