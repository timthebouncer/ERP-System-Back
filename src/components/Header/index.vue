<template>
  <div>
    <div>
      <a-icon
        class="trigger"
        align="flex-start"
        :type="$store.state.collapsed ? 'menu' : 'left'"
        @click="() => ($store.state.collapsed = !$store.state.collapsed)"
      />
    </div>
    <div class="logout">
      登出666
      <a-icon class="trigger" align="flex-end" type="logout" />
    </div>
  </div>
</template>

<script>
export default {
  name: "index"
};
</script>

<style scoped>
.logout{
  background: #000;
}
</style>
