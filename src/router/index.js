import Vue from 'vue';
import Router from 'vue-router';
import Error from '@/components/shared/error/error.vue';
import Home from '@/components/home/home.vue';

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: ''
    },{
      path: '/home',
      name: 'home',
      component: Home
    },{
      path: '/error',
      name: 'error',
      component: Error
    }
  ]
})
