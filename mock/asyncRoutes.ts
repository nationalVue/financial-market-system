// 模拟后端动态生成路由
import { defineFakeRoute } from "vite-plugin-fake-server/client";

/**
 * roles：页面级别权限，这里模拟二种 "admin"、"common"
 * admin：管理员角色
 * common：普通角色
 */
const permissionRouter = {
  path: "/permission",
  meta: {
    title: "权限管理",
    icon: "ep:lollipop",
    rank: 10
  },
  children: [
    {
      path: "/permission/page/index",
      name: "PermissionPage",
      meta: {
        title: "页面权限",
        roles: ["admin", "common"]
      }
    },
    {
      path: "/permission/button",
      meta: {
        title: "按钮权限",
        roles: ["admin", "common"]
      },
      children: [
        {
          path: "/permission/button/router",
          component: "permission/button/index",
          name: "PermissionButtonRouter",
          meta: {
            title: "路由返回按钮权限",
            auths: [
              "permission:btn:add",
              "permission:btn:edit",
              "permission:btn:delete"
            ]
          }
        },
        {
          path: "/permission/button/login",
          component: "permission/button/perms",
          name: "PermissionButtonLogin",
          meta: {
            title: "登录接口返回按钮权限"
          }
        }
      ]
    }
  ]
};
const fightingRouter = {
  path: "/dataPage",
  meta: {
    icon: "icon-park-outline:data-sheet",
    title: "数据详情",
    rank: 1
  },
  children: [
    {
      path: "/publicFund",
      component: "dataPage/index",
      name: "PublicFund",
      meta: {
        title: "公募基金"
      }
    },
    {
      path: "/privateFund",
      component: "dataPage/index",
      name: "PrivateFund",
      meta: {
        title: "私募基金"
      }
    },
    {
      path: "/managementFund",
      component: "dataPage/index",
      name: "ManagementFund",
      meta: {
        title: "私募资管"
      }
    },
    {
      path: "/securitizationFund",
      component: "dataPage/index",
      name: "SecuritizationFund",
      meta: {
        title: "资产证券化"
      }
    }
  ]
};
const fundSearchRouter = {
  path: "/fundSearch",
  meta: {
    icon: "eos-icons:content-lifecycle-management",
    title: "基金管理",
    rank: 2
  },
  children: [
    {
      path: "/fundSearch",
      component: "fundSearch/index",
      name: "FundSearch",
      meta: {
        title: "基金搜索"
      }
    },
    {
      path: "/fundrankings",
      component: "fundRankings/index",
      name: "fundrankings",
      meta: {
        title: "基金排行"
      }
    }
  ]
};
const stockRegulationRouter = {
  path: "/stockSearch",
  meta: {
    icon: "icon-park-outline:stock-market",
    title: "股票管理",
    rank: 3
  },
  children: [
    {
      path: "/stockList",
      component: "stockList/index",
      name: "StockList",
      meta: {
        title: "股票列表"
      }
    },
    {
      path: "/stockLegend",
      component: "stockLegend/index",
      name: "StockLegend",
      meta: {
        title: "股票走势"
      }
    }
  ]
};
const financialBookRouter = {
  path: "/financialBook",
  meta: {
    icon: "teenyicons:book-outline",
    title: "书籍管理",
    rank: 4
  },
  children: [
    {
      path: "/financialList/books",
      component: "financialList/books/index",
      name: "FinancialList",
      meta: {
        title: "书籍列表"
      }
    },
    {
      path: "/financialRecommend",
      component: "financialRecommend/index",
      name: "FinancialRecommend",
      meta: {
        title: "书籍推荐"
      }
    }
  ]
};
const financialNewsRouter = {
  path: "/financialNews",
  meta: {
    icon: "material-symbols:breaking-news-outline",
    title: "文章管理",
    rank: 5
  },
  children: [
    {
      path: "/financialNews/books",
      component: "financialNews/index",
      name: "FinancialNews",
      meta: {
        title: "金融期刊"
      }
    },
    {
      path: "/financialArticle",
      component: "financialArticle/index",
      name: "FinancialArticle",
      meta: {
        title: "文章添加"
      }
    }
  ]
};
export default defineFakeRoute([
  {
    url: "/get-async-routes",
    method: "get",
    response: () => {
      return {
        success: true,
        data: [
          permissionRouter,
          fightingRouter,
          fundSearchRouter,
          stockRegulationRouter,
          financialBookRouter,
          financialNewsRouter
        ]
      };
    }
  }
]);
