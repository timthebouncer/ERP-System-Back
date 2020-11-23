<template>
  <a-layout :style="{ height: '100%' }">
    <a-layout-sider
      v-model="$store.state.collapsed"
      :trigger="null"
      collapsible
      style="background: #001529"
    >
      <Sidebar />
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0;">
        <Header />
      </a-layout-header>
      <a-layout style="padding: 0 24px 24px">
        <a-breadcrumb style="margin: 16px 0" :routes="breadcrumbList">
          <template
            slot="itemRender"
            slot-scope="{ route, routes, paths }"
          >
            <span v-if="routes.indexOf(route) === routes.length - 1">
              {{ route.name }}
            </span>
            <router-link v-else :to="paths.join('/')">
              {{ route.name }}
            </router-link>
          </template>
        </a-breadcrumb>
        <a-layout-content
          :style="{
            background: '#fff',
            padding: '24px',
            margin: 0,
            minHeight: '280px'
          }"
        >
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script>
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
export default {
  name: "Home",
  components: { Sidebar, Header },
  data() {
    return {
      breadcrumbList: [],
      routes: []
    };
  },
  mounted() {
    // this.$router.push('Inventory').catch(()=>{});
    this.updateList();
    // console.log(this.$route);
  },
  watch: {
    $route() {
      this.updateList();
    }
  },
  methods: {
    routeTo(pRouteTo) {
      if (this.breadcrumbList[pRouteTo].link) {
        this.$router.push(this.breadcrumbList[pRouteTo].link);
      }
    },
    updateList() {
      this.breadcrumbList = this.$route.meta.breadcrumb;
    }
  }
};
</script>

<style scoped></style>
