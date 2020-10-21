import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/Customer",
    name: "Customer",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Customer")
  },
  {
    path: "/Inventory",
    name: "Inventory",
    component: () =>
      import("../views/Inventory")
  },
  {
    path: "/Commodity",
    name: "Commodity",
    component: () =>
        import("../views/Commodity")
  },
  {
    path: "/Label",
    name: "Label",
    component: () =>
        import("../views/Label")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
