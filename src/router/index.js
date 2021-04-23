import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: () => import( "../views/Login/Login.vue"),
    meta: {
      breadcrumb: [
        {
          name: "登入"
        }
      ]
    }
  },
  {
    path: "/Home",
    redirect:"/Inventory",
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
              name: "庫存清單"
            }
          ]
        }
      },
      {
        path: "/InventoryLog",
        name: "InventoryLog",
        component: () => import("../views/Inventory/InventoryLog"),
        meta: {
          breadcrumb: [
            {
              name: "庫存管理"
            },
            {
              name: "庫存異動紀錄"
            }
          ]
        }
      },
      {
        path: "/Warehouse",
        name: "Warehouse",
        component: () => import("../views/Inventory/Warehouse/index"),
        meta: {
          breadcrumb: [
            {
              name: "庫存管理"
            },
            {
              name: "庫存倉庫"
            }
          ]
        }
      },
      {
        path: "/Distribute",
        name: "Distribute",
        component: () => import( "../views/Inventory/Distribute"),
        meta: {
          breadcrumb: [
            {
              name: "出貨管理"
            },
            {
              name: "出貨資料"
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
              name: "客戶管理"
            },
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
        path: '/Materials',
        name: 'Materials',
        component: () => import('../views/Materials'),
        meta: {
          breadcrumb: [
            {
              name: '物料管理'
            },
            {
              name: '物料清單'
            }
          ]
        }
      },
      {
        path: '/MaterialsDepot',
        name: 'MaterialsDepot',
        component: () => import('../views/Materials/MaterialsDepot'),
        meta: {
          breadcrumb: [
            {
              name: '物料管理'
            },
            {
              name: '物料倉庫類別'
            }
          ]
        }
      },
      {
        path: '/MaterialsLog',
        name: 'MaterialsLog',
        component: () => import('../views/Materials/MaterialsLog'),
        meta: {
          breadcrumb: [
            {
              name: '物料管理'
            },
            {
              name: '物料異動紀錄'
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
      },
      {
        path: "/EditLabel",
        name: "EditLabel",
        component: () => import("../views/Label/EditLabel"),
        meta: {
          breadcrumb: [
            {
              name: "標籤管理"
            },
            {
              name: "標籤資料"
            },
            {
              name: "新增標籤"
            }
          ]
        }
      }
    ]
  }
];

const router = new VueRouter({
  // mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
