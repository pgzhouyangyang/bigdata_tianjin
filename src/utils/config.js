let dicMap = window.sessionStorage;
let obj = {};


//是否
obj = [{
  value: '0',
  label: '否'
}, {
  value: '1',
  label: '是'
}];
dicMap.setItem("sf", JSON.stringify(obj));
//完成进度
obj = [{
  value: '0',
  label: '0'
}, {
  value: '10',
  label: '10'
}, {
  value: '20',
  label: '20'
}, {
  value: '30',
  label: '30'
}, {
  value: '40',
  label: '40'
}, {
  value: '50',
  label: '50'
}, {
  value: '60',
  label: '60'
}, {
  value: '70',
  label: '70'
}, {
  value: '80',
  label: '80'
}, {
  value: '90',
  label: '90'
}, {
  value: '100',
  label: '100'
}];
dicMap.setItem("wcjd", JSON.stringify(obj));
//性别
obj = [{
  value: '0',
  label: '未知的性别'
}, {
  value: '1',
  label: '男性'
}, {
  value: '2',
  label: '女性'
}, {
  value: '9',
  label: '未说明的性别'
}];
dicMap.setItem("xb", JSON.stringify(obj));
//操作类型
obj = [{
  value: '0',
  label: '增'
}, {
  value: '1',
  label: '改'
}, {
  value: '2',
  label: '删'
}];
dicMap.setItem("czlx", JSON.stringify(obj));
import {
  dictionaries,
  xzqhDict,
  bmbmDict,
  duojiDict
} from "@/api/config";
export function doCreate(key, obj) {
  if (dicMap.getItem(key)) {
    return JSON.parse(dicMap.getItem(key))
  } else {
    diction(key, obj).then(() => {
      doCreate(key, obj);
    });
  }
}

function diction(key, obj) {
  return new Promise((resolve, reject) => {
    if (key == "xzqh") {
      xzqhDict(obj).then(res => {
        let data = res.data;
        if (data.length) {

          data.map(i => {
            i.label = i.name;
            i.value = i.bm;
            return i
          });
          dicMap.setItem(key, JSON.stringify(data));
          resolve(data);
        }
      }).catch(res => {
        console.log("失败'")
      })
    } else if (key == "bmbm") {
      bmbmDict().then(res => {
        let data = res.data;
        if (data.length) {
          data.map(i => {
            i.label = i.dictname;
            i.value = i.dictcode;
            return i
          });
          dicMap.setItem(key, JSON.stringify(data));
          resolve(data);
        }
      }).catch(res => {
        console.log("失败'")
      })
    } else if (key == "nd") {
      let date = new Date();
      let year = date.getFullYear();
      let ndArr = [];
      let dicMap = window.sessionStorage;
      for (let i = 0; i < 5; i++) {
        ndArr.push({ label: year - i, value: year - i });
      }
      dicMap.setItem("nd", JSON.stringify(ndArr));
    } else if (key == "duojiDic") {
      duojiDict().then(res => {
        let data = res.data;
        if (data.length) {
          data.map(i => {
            i.label = i.dictname;
            i.value = i.dicttype;
            return i
          });
          dicMap.setItem(key, JSON.stringify(data));
          resolve(data);
        }
      }).catch(res => {
        console.log("失败'")
      })
    } else {
      dictionaries(key).then(res => {
        let data = res.data;
        if (data.success) {
          data.data.map(i => {
            i.label = i.dictname;
            i.value = i.dictcode;
            return i
          });
          dicMap.setItem(key, JSON.stringify(data.data));
          resolve(data.data);
        }
      }).catch(res => {
        console.log("失败'")
      })
    }

  })
}



export function getDicTab(key, val) {
  let res;
  if (val === null || val === undefined) return "";
  if (dicMap.getItem(key)) {
    res = JSON.parse(dicMap.getItem(key)).filter(i => {
      return i.value == val
    });
    if (res.length) {
      res = res[0].label
    } else {
      res = val
    }
    return res;
  } else {
    diction(key).then(() => {
      getDicTab(key, val);
    })
  }
}

//多级菜单数据处理
export function moreMenu(data) {
  let _this = this;
  data.map(d => {
    if (d.children.length) {
      moreMenu(d.children);
    } else {
      delete d.children;
    }
    return d;
  });
}

//打印
//打印
export function printExcel(id) {
  // let Print = document.getElementById(id);
  // let arr = Array.prototype.slice.call(Print.getElementsByClassName('el-table__body')[0].getElementsByClassName('cell'));
  // let tab = Array.prototype.slice.call(Print.querySelectorAll('table'));
  // debugger
  // arr.map(i=>{
  //     i.setAttribute("style","width:100%!important");
  // })
  // tab.map(j=>{
  //   j.setAttribute("style","width:100%!important");
  // })
  // let newContent = Print.innerHTML;
  // let oldContent = document.body.innerHTML;
  // document.body.innerHTML = newContent;
  // window.print();
  // document.body.innerHTML = oldContent;
  // window.location.reload();
  // return false
  let printStr = "<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'></head>";
  const tabStyle = `<style>
  table{width:100%;display:table-cell!important;box-sizing:border-box;}
  .el-table__header,.el-table__body,.el-table__footer{width:100%!important;border-collapse: collapse;text-align:center;}
  table,table tr th, table tr td { border:1px solid #ddd;color:#606266;}
  table tr th,table tr td{padding:4mm 0mm }
  .el-table__body, tr td .cell{width:100%!important}
  .el-table th.gutter{display: none;}
  .el-table colgroup.gutter{display: none;}
  </style><body>`;
  let content = "";
  let str = document.getElementById(id).innerHTML;
  content = content + str;
  printStr = printStr + tabStyle + content + "</body></html>";
  let pwin = window.open("_blank");
  pwin.document.write(printStr);
  pwin.document.close();
  pwin.focus();
  setTimeout(() => {
    pwin.print();
    pwin.close();
  }, 500);

}
//导出
import FileSaver from 'file-saver'
import XLSX from 'xlsx';
export function exportExcel(id) {
  // var arr = Array.prototype.slice.call(document.getElementsByClassName('has-gutter')[1].getElementsByClassName('is-leaf'));
  // arr.map(i => {
  //   i.setAttribute("rowspan", "1");
  // })
  /* generate workbook object from table */
  var wb = XLSX.utils.table_to_book(document.querySelector('#' + id))
  /* get binary string as output */
  var wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'array'
  })
  try {
    FileSaver.saveAs(new Blob([wbout], {
      type: 'application/octet-stream'
    }), id + '.xlsx')
  } catch (e) {
    if (typeof console !== 'undefined') console.log(e, wbout)
  }
  return wbout
}
