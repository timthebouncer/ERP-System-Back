import Vue from "vue";
import Antd from 'ant-design-vue'
import App from "./App.vue";
import router from "./router";
import store from "./store";
import 'ant-design-vue/dist/antd.css'
import api from "./api/apis";
import './style/main.scss'
import ConfigProvider from 'ant-design-vue'

Vue.use(ConfigProvider)
Vue.config.productionTip = false;
Vue.use(Antd)
Vue.prototype.$api = api;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
