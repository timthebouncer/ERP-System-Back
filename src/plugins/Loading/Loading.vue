<template>
  <transition name="loading-fade">
    <div v-show="visible" class="erp-loading">
      <a-spin>
        <a-icon slot="indicator" type="loading" style="font-size: 40px" spin />
      </a-spin>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'Loading',
    data(){
      return {
        visible: false
      }
    }
  }
</script>

<style lang="scss" scoped>
.erp-loading{
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255,255,255,0.5);
}
</style>