import Vue from 'vue'
import Antd from 'ant-design-vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'ant-design-vue/dist/antd.css'
import api from './api/apis'
import './style/main.scss'
import ConfigProvider from 'ant-design-vue'
import loading from '@/plugins/Loading/index.js'
import myutils from './utils/index.js';

Vue.use(ConfigProvider)
Vue.config.productionTip = false;
Vue.config.productionTip = false
Vue.use(Antd)
Vue.use(loading)
Vue.prototype.$api = api
Vue.prototype.$myutils=myutils;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
