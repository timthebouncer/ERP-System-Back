<template>
  <div class="sidebarColor">
    <div v-if="!$store.state.collapsed" class="logo" align="center" style="font-size: large;cursor:pointer" @click="goHome">進銷存SYS
    <i class="line"></i>
    </div>
    <div v-else class="logo" align="center" style="font-size: large">SYS
    <i class="line2"></i>
    </div>
    <div>
      <a-menu mode="inline" :style="{ height: '100%', borderRight: 0 }"
              :defaultOpenKeys="openKeys"
              :default-selected-keys="selectedKeys"
              :theme="theme"
      >
        <a-sub-menu key="sub1">
          <span slot="title"><a-icon type="database" /><span>庫存管理</span></span>
          <a-menu-item key="Warehouse" @click="()=>{$router.push('Warehouse').catch(()=>{})}">
            倉庫類別
          </a-menu-item>
          <a-menu-item key="Inventory" @click="()=>{$router.push('Inventory').catch(()=>{})}">
            庫存清單
          </a-menu-item>
          <a-menu-item key="InventoryLog" @click="()=>{$router.push('InventoryLog').catch(()=>{})}">
            庫存異動紀錄
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <span slot="title"><a-icon type="shop" /><span>出貨管理</span></span>
          <a-menu-item key="Distribute" @click="()=>{$router.push('Distribute').catch(()=>{})}">
            出貨資料
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub3">
          <span slot="title"><a-icon type="profile" /><span>客戶管理</span></span>
          <a-menu-item key="Classify" @click="()=>{$router.push('Classify')}">
            客戶類別
          </a-menu-item>
          <a-menu-item key="Customer" @click="()=>{$router.push('Customer').catch(()=>{})}">
            客戶資料
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub4">
          <span slot="title"><a-icon type="shop" /><span>商品管理</span></span>
          <a-menu-item key="Commodity" @click="()=>{$router.push('Commodity').catch(()=>{})}">
            商品資料
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub6">
          <span slot="title"><a-icon type="shop" /><span>物料管理</span></span>
          <a-menu-item
            key="MaterialsDepot"
            @click="
              () => {
                $router.push('MaterialsDepot').catch(() => {})
              }
            "
          >
            物料倉庫
          </a-menu-item>
          <a-menu-item
            key="Materials"
            @click="
              () => {
                $router.push('Materials').catch(() => {})
              }
            "
          >
            物料清單
          </a-menu-item>
          <a-menu-item
            key="MaterialsLog"
            @click="
              () => {
                $router.push('MaterialsLog').catch(() => {})
              }
            "
          >
            物料異動紀錄
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub5">
          <span slot="title"><a-icon type="setting" /><span>標籤管理</span></span>
          <a-menu-item key="Label" @click="()=>{$router.push('Label').catch(()=>{})}">
            標籤資料
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storeKey: '',
      theme: 'dark',
      openKeys: [],
      selectedKeys: []
    }
  },
  created() {
    this.selectedKeys = [this.$route.name]
    switch (this.$route.name) {
      case 'Inventory':
      case 'InventoryLog':
        return this.openKeys = ['sub1']
      case 'Distribute':
        return this.openKeys = ['sub2']
      case 'Customer':
      case 'Classify':
        return this.openKeys = ['sub3']
      case 'Commodity':
        return this.openKeys = ['sub4']
      case 'Label':
        return (this.openKeys = ['sub5'])
      case 'Materials':
      case 'MaterialsDepot':
      case 'MaterialsLog':
        return (this.openKeys = ['sub6'])
    }
  },
  methods: {
    goHome(){
      this.$router.push('/')
    }
    },
};
</script>
<style lang="scss" scoped>
.logo{
  color: #fff;
  background-color: #001529;
  position: relative;
}
.line{
  height: 2px;
  width: 100px;
  display: inline-block;
  background: #1890ff;
  position: absolute;
  bottom: 5px;
  left: 50%;
  margin-left: -50px;
}
.line2{
  height: 3px;
  width: 30px;
  display: inline-block;
  background: #1890ff;
  position: absolute;
  bottom: 5px;
  left: 50%;
  margin-left: -15px;
}
</style>
