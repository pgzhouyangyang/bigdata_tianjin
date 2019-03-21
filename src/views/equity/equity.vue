<template>
  <div class="home">
    <div class="homeTit">
      <img src="../../assets/titPic.png" alt="">
    </div>
    <div class="homeLeft fl">
      <div class="LeftBox">
        <h3>股份经济合作社</h3>
        <div class="conEcharts">
            <echarts ref="gfChart" v-show="clickNum == 0" chartId="gfChart"></echarts>
            <echarts-table :dataList="gfArr" v-show="clickNum > 0"></echarts-table>
         </div>
      </div>
      <div class="LeftBox">
        <h3>股东类型</h3>
        <div class="conEcharts">
        <echarts ref="gbTypeChart" chartId="gbTypeChart"></echarts>
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
          <echarts2  ref="lhzcChart" chartId="lhzcChart" v-show="clickNum == 0"></echarts2>
          <echarts-table :dataList="lhzcArr" v-show="clickNum > 0"></echarts-table>
        </div>
        
      </div>
    </div>
    <div class="homeRight fl">
      <div class="rightBox">
        <h3>股东数量</h3>
        <div class="conEcharts">
        <echarts  ref="gdSumChart" chartId="gdSumChart" v-show="clickNum == 0"></echarts>
         <echarts-table :dataList="gdSumArr" v-show="clickNum > 0"></echarts-table>
        </div>
      </div>
      <div class="rightBox">
        <h3>累计分红</h3>
        <div class="conEcharts">
          <echarts  ref="ljfhSumChart" chartId="ljfhSumChart" v-show="clickNum == 0"></echarts>
           <echarts-table :dataList="ljfhArr" v-show="clickNum > 0"></echarts-table>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import Echarts from "../../components/echarts/pie";
import EchartsTable from "../../components/echarts/table";
import Echarts2 from "../../components/echarts/bar";
import tianjJs from "../../../static/tianj";
import { dzQuery, getRynum, getGfSum, getGdLx, getGdSum, getLjfhzeSum, getLhzczeSum } from "@/api/homeDetail";
export default {
  components: {
    Echarts,
    Echarts2,
    EchartsTable
  },
  data() {
    return {
      dhmbArr: [],
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
        this.lhzcSumEchart();
        this.gdTypeEchart();
        this.gdSumEchart();
        this.ljfhSumEchart();
    },
    async getZxqhData() {
        this.xzqhArr = []
        let result = await getRynum({
            orgcode: this.dhmbArr[this.clickNum].value
        });
        this.xzqhArr = result.data.result;
    },
    // 股份经济合作社
    async gfSumEchart() {
        
        this.gfArr = [];
        let result = await getGfSum({
            orgcode: this.dhmbArr[this.clickNum].value
        });
        this.gfArr = result.data.result;
        if(this.clickNum>0)return;
        let data = [];
        let legend = [];
         this.gfArr.forEach(item => {
            data.push({
              name: item.orgname,
              value: item.sum
            });
            legend.push(item.orgname)
        });
        
        this.$refs.gfChart.renderChart( {
           name: "股份经济合作社",
           data: data,
           legend:{
             show: false
           },
            label: {
           normal: {
                formatter: "{b}: {c}"
              }
        }
          
        })
    },
    // 量化资产
    async lhzcSumEchart() {
        this.lhzcArr = []
        // 获取数据
        let result = await getLhzczeSum({
            orgcode: this.dhmbArr[this.clickNum].value
        });
       
        this.lhzcArr = result.data.result;
        if(this.clickNum>0)return;

        let xData = [];
        let yData = [];
        result.data.result.forEach((item)=> {
            xData.push(item.orgname);
            yData.push(item.sum)
        })
        // 创建图表
        this.$refs.lhzcChart.renderChart( {
          name: "量化资产",
          xData,
          yData,
          formatter: function(params, ticket, callback) {
          return  `<div class="hm-charts-tooltip">
                      <div class="hm-charts-tooltip-header">
                          <span class="hm-charts-tooltip-header-category">
                              ${params.name}
                          </span>
                      </div>
                      <div class="hm-charts-tooltip-body">
                          <p class="hm-charts-tooltip-item">
                              <span class="hm-charts-tooltip-item-icon" style="color:${params.color}">
                              ● 
                              </span>
                              <span class="hm-charts-tooltip-item-label">量化资产总额 ${params.value}</span>
                          </p>
                      </div>
                  </div>`
        }
      })
    },
    // 股东类型
    async gdTypeEchart() {
        let result = await getGdLx({
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
        this.$refs.gbTypeChart.renderChart( {
           name: "股东数量",
           data: data,
           legend:{
              orient: "vertical",
              type: 'scroll',
                x: "right",
                data: legend,
                textStyle: {
                  color: "#fff"
                }
              },
              label: {
                normal: {
                      formatter: "{b}: {c}"
                    }
              }
        })
    },
    // 股东数量
    async gdSumEchart() {
        this.gdSumArr = []
       let result = await getGdSum({
            orgcode: this.dhmbArr[this.clickNum].value
        });
        this.gdSumArr = result.data.result;
        if(this.clickNum>0)return;
        let data = [];
        let legend = [];
        
        result.data.result.forEach(item => {
            data.push({
              name: item.orgname,
              value: item["个人股东"]  + item["集体股东"]
            });
            legend.push(item.orgname)
        });
        this.$refs.gdSumChart.renderChart( {
          //  color: legend.length?['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']:'#749f83',
           name: "股东数量",
           data: data,
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
        this.ljfhArr = [];
       let result = await getLjfhzeSum({
            orgcode: this.dhmbArr[this.clickNum].value
        });
         this.ljfhArr = result.data.result;
          if(this.clickNum>0)return;
        let data = [];
        let legend = [];
        result.data.result.forEach(item => {
            data.push({
              name: item.orgname,
              value: item.sum
            });
            legend.push(item.orgname)
        });
        this.$refs.ljfhSumChart.renderChart( {
          //  color: legend.length?['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']:'#749f83',
           name: "累计分红",
           data:  data,
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

