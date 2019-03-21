// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import "babel-polyfill"
// import ElementUI from 'element-ui';
// 按需引入element组件
import {
  Input,
  Form,
  FormItem,
  Progress,
  Loading,
  Scrollbar,
  Button,
  Notification
} from 'element-ui';
Vue.use(Input);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Progress);
Vue.use(Button);
Vue.use(Scrollbar);
Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$notify = Notification;

import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI);

// import echarts from 'echarts'

// 按需引入eCharts组件
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
// 引入地图组件
require('echarts/lib/chart/map');
// 引入饼状图
require('echarts/lib/chart/pie');
// 引入柱状图
require('echarts/lib/chart/bar');
// 引入提示框和legend
require('echarts/lib/component/tooltip');
require('echarts/lib/component/legend');

Vue.prototype.$echarts = echarts;

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
