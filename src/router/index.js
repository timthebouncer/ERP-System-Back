import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home"),
    meta: {
      breadcrumb: [
        {
          name: "庫存管理"
        },
        {
          name: "庫存清單"
        }
      ]
    },
    children: [
      {
        path: "/Inventory",
        name: "Inventory",
        component: () => import("../views/Inventory"),
        meta: {
          breadcrumb: [
            {
              name: "庫存管理"
            },
            {
              name: "庫存資料"
            }
          ]
        }
      },
      // {
      //   path: "/InventoryLog",
      //   name: "InventoryLog",
      //   component: () => import("../views/Inventory/InventoryLog"),
      //   meta: {
      //     breadcrumb: [
      //       {
      //         name: "庫存管理"
      //       },
      //       {
      //         name: "庫存異動紀錄"
      //       }
      //     ]
      //   }
      // },
      {
        path: "/Distribute",
        name: "Distribute",
        component: () => import( "../views/Inventory/Distribute.vue"),
        meta: {
          breadcrumb: [
            {
              name: "銷貨資料"
            }
          ]
        }
      },
      {
        path: "/Customer",
        name: "Customer",
        component: () => import("../views/Customer"),
        meta: {
          breadcrumb: [
            {
              name: "客戶管理"
            },
            {
              name: "客戶資料"
            }
          ]
        }
      },
      {
        path: "/Classify",
        name: "Classify",
        component: () => import( "../views/Customer/Classify.vue"),
        meta: {
          breadcrumb: [
            {
              name: "客戶類別"
            },
          ]
        }
      },
      {
        path: "/Commodity",
        name: "Commodity",
        component: () => import("../views/Commodity"),
        meta: {
          breadcrumb: [
            {
              name: "商品管理"
            },
            {
              name: "商品資料"
            }
          ]
        }
      },
      {
        path: "/Label",
        name: "Label",
        component: () => import("../views/Label"),
        meta: {
          breadcrumb: [
            {
              name: "標籤管理"
            },
            {
              name: "標籤資料"
            }
          ]
        }
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
