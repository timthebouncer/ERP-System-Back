import Vue from 'vue'
import Loading from './Loading.vue'
// Loading構造函數
const Mask = Vue.extend(Loading)
const loadingDirective = {}
loadingDirective.install = (Vue) => {
  // 切換組件狀態函數
  const toggleLoading = (el, binding) => {
    if (binding.value) {
      Vue.nextTick(() => {
        insertDom(el, el, binding)
      })
    } else {
      el.instance.visible = false
    }
  }
  // 插入Loading
  const insertDom = (parent, el) => {
    parent.appendChild(el.mask)
    el.instance.visible = true
  }
  Vue.directive('loading', {
    bind: function(el, binding) {
      const mask = new Mask({
        el: document.createElement('div'),
        data: {},
      })
      el.instance = mask
      el.mask = mask.$el
      el.maskStyle = {}
      binding.value && toggleLoading(el, binding)
    },
    update: function(el, binding) {
      if (binding.oldValue !== binding.value) {
        toggleLoading(el, binding)
      }
    },
    unbind: function() {
    },
  })
}
export default loadingDirective