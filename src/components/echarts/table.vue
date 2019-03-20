<template>
  <div class="tableList-charts">
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
          <tr v-for="(item,index) in dataList" :key="index">
            <td>{{item.orgname}}</td>
            <td>{{item | count}}</td>
            <td>
              <el-progress :percentage="computedPer(item)"></el-progress>
            </td>
          </tr>
          <tr v-if="!dataList.length">
            <td colspan="3">
              <div class="empty">暂无统计数据</div>
            </td>
          </tr>
        </tbody>
      </table>
    </el-scrollbar>
  </div>
</template>
<script>
export default {
  props: {
    dataList: [Array, Object]
  },
  data() {
    return {};
  },
  computed: {
    total() {
      let total = 0;
      this.dataList.forEach(item => {
        if (typeof item.sum != "undefined") {
          total += parseInt(item.sum);
        } else {
          let num = 0;
          for (const key in item) {
            if (typeof item[key] == "number") {
              num += item[key];
            }
          }
          total += parseInt(num);
        }
      });

      return total;
    }
  },
  filters: {
    count(item) {
      if (typeof item.sum != "undefined") {
        return item.sum;
      } else {
        let num = 0;
        for (const key in item) {
          if (typeof item[key] == "number") {
            num += item[key];
          }
        }
        return num;
      }
    }
  },
  methods: {
    // 计算占比
    computedPer(item) {
      if (this.total > 0) {
        if (typeof item.sum != "undefined") {
          return parseInt((item.sum / this.total) * 100);
        } else {
          let num = 0;
          for (const key in item) {
            if (typeof item[key] == "number") {
              num += item[key];
            }
          }
          return parseInt((num / this.total) * 100);
        }
      }
      return 0;
    }
  }
};
</script>
<style lang="scss" scoped>
.tableList-charts {
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
<style lang="scss">
.tableList-charts {
  .el-scrollbar__wrap {
    overflow-x: hidden !important;
  }
  .el-scrollbar__bar.is-horizontal {
    display: none;
  }
  .el-progress__text {
    color: #fff;
  }
}
</style>


