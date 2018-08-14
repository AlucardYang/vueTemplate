// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import VueResource from 'vue-resource';
import Error from '@/components/shared/error/error.vue';
import Home from '@/components/home/home.vue';
import Mint from 'mint-ui';

Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(Mint);

// 增加监控
// var fundebug = require("fundebug-javascript");
// fundebug.apikey = "ff02f13a621cf2b1f1efc4f330be0b80347887a7e20cff2539f73d84ffa4abe9";

// function formatComponentName(vm) {
//   if (vm.$root === vm) return 'root';
//   var name = vm._isVue ? (vm.$options && vm.$options.name) || (vm.$options && vm.$options._componentTag) : vm.name;
//   return (name ? 'component <' + name + '>' : 'anonymous component') + (vm._isVue && vm.$options && vm.$options.__file ? ' at ' + (vm.$options && vm.$options.__file) : '');
// }

// Vue.config.errorHandler = function (err, vm, info) {
//   var componentName = formatComponentName(vm);
//   var propsData = vm.$options && vm.$options.propsData;
//   fundebug.notifyError(err, {
//     metaData: {
//       componentName: componentName,
//       propsData: propsData,
//       info: info
//     }
//   });
// };

// 现有路由表
const routes = {
  '/error': Error,
  '/home': Home
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>',
  beforeCreate: function () {
    let path = window.location.pathname;
    this.$http.get('https://h5.goodiber.com/test/url', {
      path: path
    }).then(function (res) {
      res.body.data.url = '/home';
      this.$router.addRoutes([{
        path: path,
        component: routes[res.body.data.url] || Error,
        name: 'dynamicComponent'
      }]);
      // 响应成功回调
    }, function (res) {
      // 响应错误回调
    });
  }
})