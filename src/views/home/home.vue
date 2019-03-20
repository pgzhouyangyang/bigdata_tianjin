<template>
  <div class="home">
    <div class="homeTit">
      <img src="../../assets/titPic.png" alt="">
    </div>
    <div class="homeLeft fl">
      <div class="LeftBox">
        <h3>成员数量统计</h3>
        <div class="conEcharts">
        <echarts1 :echarObj="echarObj" :memberData="xzqhArr"></echarts1>
         </div>
      </div>
      <div class="LeftBox">
        <h3>年龄分布统计</h3>
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
    </div>
    <div class="homeRight fl">
      <div class="rightBox">
        <h3>民族分析统计</h3>
        <div class="conEcharts">
        <echarts3  :xzqhCode="orgcode"></echarts3>
        </div>
      </div>
      <div class="rightBox">
        <h3>性别分析统计</h3>
        <div class="conEcharts">
          <echarts4  :xzqhCode="orgcode"></echarts4>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import Echarts1 from "./memberEcharts";
import Echarts2 from "./ageEcharts";
import Echarts3 from "./nationEcharts";
import Echarts4 from "./genderEcharts";
import tianjJs from "../../../static/tianj";
import { dzQuery, getRynum } from "@/api/homeDetail";
export default {
  components: {
    Echarts1,
    Echarts2,
    Echarts3,
    Echarts4
  },
  data() {
    return {
      echarObj: {},
      dhmbArr: [
      ],
      clickNum: 0,
      xzqhArr: [],
      orgcode: "",
    };
  },
  created() {
  },
  methods: {
     // 行政区划查询
    xzqhQuery() {
      this.xzqhArr = [];
      getRynum({
        orgcode:this.dhmbArr[this.clickNum].value,
      }).then(res => {
        let data = res.data;
        this.xzqhArr = data.result;
      });
    },
    dhMbClick(item, index) {
      if (item.value.length < this.getCookie("orgcode").length) {
        return;
      }
      this.clickNum = index;
      this.orgcode = item.value;
      this.$set(this.echarObj, "clickNum", index)
      this.$set(this.echarObj, "orgcode",item.value)
      this.dhmbArr.splice(index + 1);
      // if (index > 0) {
        this.xzqhQuery();
      // }
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
        _this.$set(_this.echarObj, "clickNum", _this.clickNum);
        _this.$set(_this.echarObj, "orgcode", _this.orgcode);
        _this.xzqhQuery()
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
      this.$set(this.echarObj, "clickNum",this.clickNum);
      this.$set(this.echarObj, "orgcode", row.orgcode);
      this.xzqhQuery();
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
    dzSelect(orgcode) {
      dzQuery({
         orgcode
      }).then(res => {
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
          this.drawLine();
          this.xzqhQuery();
        }
      });
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
      this.echarObj = {
        clickNum,
        orgcode
      }
      this.dzSelect(orgcode);
  }
};
</script>
<style lang="scss" scoped>
  @import "../../assets/style/cg.scss";
</style>

