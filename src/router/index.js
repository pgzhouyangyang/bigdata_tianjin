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
      path: '/equity',
      component: () => import('@/views/equity/equity'),
      name: 'equity',
    },
    {
      path: '/login',
      component: () => import('@/views/login/login'),
      name: 'login',
    },
  ]
})
