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
    <div>
      登出
      <a-icon class="trigger" align="flex-end" type="logout" />
    </div>
  </div>
</template>

<script>
export default {
  name: "index"
};
</script>

<style scoped></style>
