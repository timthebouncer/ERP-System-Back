import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    collapsed:false,
    logout:false,
    labelMode:'add',
    labelData:{
      id: '',
      tagName: '',
      updateDate: '',
      showFront: false,
      svgString: '',
      ip:''
    }
  },
  mutations: {},
  actions: {},
  modules: {}
});
