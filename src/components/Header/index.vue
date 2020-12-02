<template>
  <div class="header">
    <div>
      <a-icon
        class="trigger"
        align="flex-start"
        :type="$store.state.collapsed ? 'menu' : 'left'"
        @click="() => ($store.state.collapsed = !$store.state.collapsed)"
      />
    </div>
    <div class="logout">
      <span style="font-size: 18px; font-weight: bold">登出</span>
      <a-icon class="logout-btn" type="logout" @click="() =>logoutHandler()" />
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  methods:{
    logoutHandler(){
      this.$api.Login.logOut()
      .then((res)=>{
        console.log(res)
        this.$router.push('/')
      })
    }
  }
};
</script>

<style scoped>
.header{
  display: flex;
  justify-content: space-between;
}
.logout{
  margin-left: -10px;
  width: 100px;
}
.logout-btn{
  font-size: 18px;
  line-height: 64px;
  padding: 0 5px;
  cursor: pointer;
  transition: color 0.3s;
}
.logout-btn:hover {
  color: #1890ff;
}
</style>
