import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
   
    {
      path: '/',
      name: 'home',
      component:() =>
      import('@/views/home/home'),
    },
    {
      path: '/login',
      component: () => import('@/views/login/index'),
      name: 'login',
    },
    {
      path: '/equity',
      component: () => import('@/views/equity/equity1'),
      name: 'equity',
    }
  ]
})
