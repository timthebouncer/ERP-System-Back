<template>
  <div>
    <div v-if="!$store.state.collapsed" class="logo" align="center" style="font-size: large">進銷存SYS</div>
    <div v-else class="logo" align="center" style="font-size: large">SYS</div>
    <a-menu mode="inline" :style="{ height: '100%', borderRight: 0 }" :default-selected-keys="['1']" :open-keys.sync="openKeys">
      <a-sub-menu key="sub1">
        <span slot="title"><a-icon type="mail" /><span>庫存管理</span></span>
        <a-menu-item key="1" @click="()=>{$router.push('Inventory').catch(()=>{})}">
          庫存資料
        </a-menu-item>
        <a-menu-item key="2" @click="()=>{$router.push('Distribute').catch(()=>{})}">
          進銷紀錄
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub2">
        <span slot="title"><a-icon type="appstore" /><span>客戶管理</span></span>
        <a-menu-item key="3" @click="()=>{$router.push('Classify')}">
          客戶類別
        </a-menu-item>
        <a-menu-item key="4" @click="()=>{$router.push('Customer').catch(()=>{})}">
          客戶資料
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub3">
        <span slot="title"><a-icon type="setting" /><span>商品管理</span></span>
        <a-menu-item key="5" @click="()=>{$router.push('Commodity').catch(()=>{})}">
          商品資料
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub4">
        <span slot="title"><a-icon type="setting" /><span>標籤管理</span></span>
        <a-menu-item key="6" @click="()=>{$router.push('Label').catch(()=>{})}">
          標籤資料
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // current: ['mail'],
      openKeys: ['sub1'],
    };
  },
  mounted() {

  }
};
</script>

<style lang="scss" scoped></style>
