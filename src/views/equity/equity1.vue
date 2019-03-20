<template>
  <div class="home">
    <div class="homeTit">
      <img src="../../assets/titPic.png" alt="">
    </div>
    <div class="homeLeft fl">
      <div class="LeftBox">
        <h3>股份经济合作社</h3>
        <div class="conEcharts">
            <echarts1 ref="gfChart" v-show="clickNum == 0" chartId="gfChart"></echarts1>
            <echarts-table1 :dataList="gfArr" v-show="clickNum > 0"></echarts-table1>
         </div>
      </div>
      <div class="LeftBox">
        <h3>股东类型</h3>
        <div class="conEcharts">
        <Echarts2  :xzqhCode="orgcode"></Echarts2>
         </div>
      </div>
    </div>
    <div class="homeCenter fl">
      <div class="centerTop">
        <div class="dhMb">
          <p v-for="(item,index) in dhmbArr" :key="index" @click="dhMbClick(item,index)">{{index==dhmbArr.length-1?item.name:item.name+">>"}}</p>
        </div>
        <div v-show="clickNum==0" class="mapEcharts" id="myChartMap">

        </div>
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
                    <el-button size="mini" type="primary" @click="seeClick(item)" >查看</el-button>
                  </td>
                  
                </tr>
                  <tr v-if="xzqhArr && !xzqhArr.length">
                    <td colspan="4"> <div class="empty" >暂无统计数据</div></td>
                  
                  </tr>
              </tbody>
            </table>
          </el-scrollbar>
        </div>
      </div>
      <div class="centerButtom centerButtom--charts">
          <h3>量化资产总额</h3>
          <div class="conEcharts">
          <echarts5  :echarObj="echarObj" :xzqhCode="orgcode"></echarts5>
        </div>
        
      </div>
    </div>
    <div class="homeRight fl">
      <div class="rightBox">
        <h3>股东数量</h3>
        <div class="conEcharts">
        <echarts3  :echarObj="echarObj" :xzqhCode="orgcode"></echarts3>
        </div>
      </div>
      <div class="rightBox">
        <h3>累计分红</h3>
        <div class="conEcharts">
          <echarts4  :echarObj="echarObj" :xzqhCode="orgcode"></echarts4>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import Echarts1 from "../../components/echarts/pie";
import EchartsTable1 from "../../components/echarts/table";
import Echarts2 from "../../components/echarts/bar";
import EchartsTable2 from "../../components/echarts/table";
import Echarts3 from "../../components/echarts/pie";
import EchartsTable3 from "../../components/echarts/table";
import Echarts4 from "../../components/echarts/pie";
import EchartsTable4 from "../../components/echarts/table";
import Echarts5 from "../../components/echarts/bar";
import tianjJs from "../../../static/tianj";
import { dzQuery, getRynum, gfArr, getNlnum, getMznum } from "@/api/homeDetail";
export default {
  components: {
    Echarts1,
    Echarts2,
    Echarts3,
    Echarts4,
    Echarts5,
    EchartsTable1,
    EchartsTable2,
    EchartsTable3,
    EchartsTable4,
  },
  data() {
    return {
      echarObj: {},
      dhmbArr: [
      ],
      clickNum: 0,
      orgcode: "",
      xzqhArr: [], // 行政区划列表
      gfArr: [], // 股份经济合作列表
      lhzcArr: [], // 量化资产总额列表
      gdTypeArr: [], // 股东类型列表
      gdSumArr: [], // 股东数量列表
      ljfhArr: [] // 累计分红列表
    };
  },
  created() {
  },
  methods: {
    init() {
        this.getZxqhData();
        this.gfSumEchart();
        // this.lhzcSumEchart();
        // this.gdTypeEchart();
        // this.gdNumEchart();
        // this.ljfhSumEchart();
    },
    async getZxqhData() {
        let result = await getRynum({
            orgcode: this.dhmbArr[this.clickNum].value
        });
        this.xzqhArr = result.data.result;
    },
    // 股份经济合作社
    async gfSumEchart() {
        this.gfArr = [];
        let result = await gfArr({
            orgcode: this.dhmbArr[this.clickNum].value
        });
        this.gfArr = result.data.result;
        // let data = [];
        // let legend = [];
        //  this.gfArr.forEach(item => {
        //     data.push({
        //       name: item.orgname,
        //       value: item.sum
        //     });
        //     legend.push(item.orgname)
        // });
        
        // this.$refs.gfChart.renderChart( {
        //    name: "股份经济合作社",
        //    data: data,
        //    legend:{
        //      show: false
        //    },
          
        // })
    },
    // 量化资产
    async lhzcSumEchart() {
        
         let result = await getNlnum({
            orgcode: this.dhmbArr[this.clickNum].value
        });
        let xData = ['10', '20', '30', '40', '50', '60', '70', "80", "90", "100", "100以上"];
        let yData = [];
         for (const key in result.data.result) {
          yData.push(result.data.result[key])
          }
          this.$refs.ageChart.renderChart( {
           name: "数量",
           xData,
           yData,
            formatter:function(params, ticket, callback) {
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
        })
    },
    // 股东类型
    async gdTypeEchart() {
        let result = await getSexnum({
            orgcode: this.dhmbArr[this.clickNum].value
        });
        let legend = [];
        let data = []
        for (const key in result.data.result) {
          legend.push(key);
          data.push({
            name: key,
            value: result.data.result[key]
          })
        }
        this.$refs.genderChart.renderChart( {
           name: "数量",
           data: data,
           legend:{
             orient: "vertical",
          type: 'scroll',
            x: "right",
            data: ["男", "女"],
            textStyle: {
              color: "#fff"
            }
           }
        })
    },
    // 股东数量
    async gdNumEchart() {
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
            legend.push(item.name)
        });
        this.$refs.nationChart.renderChart( {
           color: legend.length?['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']:'#749f83',
           name: "数量",
           data:  data.length?data: [{name: "暂无统计数据", value: 0}],
           legend:{
                orient: "vertical",
                type: 'scroll',
                x: "right",
                data: legend.length?legend: ["暂无统计数据"],
                textStyle: {
                  color: "#fff"
                }
           },
            label: {
              show: false,
           },
          
        })
    },
    // 累计分红总额
    async ljfhSumEchart() {
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
            legend.push(item.name)
        });
        this.$refs.nationChart.renderChart( {
           color: legend.length?['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']:'#749f83',
           name: "数量",
           data:  data.length?data: [{name: "暂无统计数据", value: 0}],
           legend:{
                orient: "vertical",
                type: 'scroll',
                x: "right",
                data: legend.length?legend: ["暂无统计数据"],
                textStyle: {
                  color: "#fff"
                }
           },
            label: {
              show: false,
           },
          
        })
    },
    dhMbClick(item, index) {
      if (item.value.length < this.getCookie("orgcode").length) {
        return;
      }
      this.clickNum = index;
      this.orgcode = item.value;
     
      this.dhmbArr.splice(index + 1);
      this.init()
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
        
        _this.init()
      });
      window.addEventListener("resize", function() {
        myChartMap.resize();
      });
    },
    // 查看行政区划
    seeClick(row) {
      if(this.clickNum == 2) {
        return
      }
      this.clickNum++;
      this.dhmbArr.push({
        name: row.orgname,
        value: row.orgcode
      });
      this.orgcode = row.orgcode;
     this.init()
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
        let res =  await dzQuery({orgcode});
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
          this.init()
        }
    }
  },
  mounted() {
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
      this.drawLine()
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/style/cg.scss";
</style>

