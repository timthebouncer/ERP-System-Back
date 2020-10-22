<template>
  <div id="app">
    <a-layout :style="{ height: '100%' }">
      <a-layout-sider
        v-model="$store.state.collapsed"
        :trigger="null"
        collapsible
        style="background: #FFF"
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
              slot-scope="{ route, params, routes, paths }"
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
  </div>
</template>
<script>
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

export default {
  components: { Sidebar, Header },
  data() {
    return {
      breadcrumbList:[],
      routes:[]
    };
  },
  mounted() {
    // this.routes = this.$router.options.routes;
    // this.updateList();
    console.log(this.$route);
  },
  watch:{
    '$route'(){this.updateList()}
  },
  methods:{
    routeTo(pRouteTo){
      if(this.breadcrumbList[pRouteTo].link){
        this.$router.push(this.breadcrumbList[pRouteTo].link);
      }
    },
    updateList() {
      this.breadcrumbList = this.$route.meta.breadcrumb;
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  height: 100%;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>
