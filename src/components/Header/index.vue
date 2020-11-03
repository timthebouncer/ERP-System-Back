<template>
  <div>
    <div>
      <a-icon
        class="trigger"
        align="flex-start"
        :type="$store.state.collapsed ? 'menu-unfold' : 'menu-fold'"
        @click="() => ($store.state.collapsed = !$store.state.collapsed)"
      />
      <!--    <div class="logo"/>-->
      <!--    <a-menu-->
      <!--            theme="dark"-->
      <!--            mode="horizontal"-->
      <!--            :default-selected-keys="['2']"-->
      <!--            :style="{ lineHeight: '64px' }"-->
      <!--    >-->
      <!--        <a-menu-item key="1">-->
      <!--            nav 1-->
      <!--        </a-menu-item>-->
      <!--        <a-menu-item key="2">-->
      <!--            nav 2-->
      <!--        </a-menu-item>-->
      <!--        <a-menu-item key="3">-->
      <!--            nav 3-->
      <!--        </a-menu-item>-->
      <!--    </a-menu>-->
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
