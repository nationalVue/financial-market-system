import App from "./App.vue";
import router from "./router/index.js";
import { setupStore } from "@/store";
import { getPlatformConfig } from "@/config";
import { MotionPlugin } from "@vueuse/motion";
import { createApp, type Directive } from "vue";
import { injectResponsiveStorage } from "./utils/responsive.js";

// 引入 Element Plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";

// 引入 ECharts
import * as echarts from "echarts";

import Table from "@pureadmin/table";

// 引入重置样式
import "./style/reset.scss";
// 导入公共样式
import "./style/index.scss";
// 一定要在main.ts中导入tailwind.css，防止vite每次hmr都会请求src/style/index.scss整体css文件导致热更新慢的问题
import "./style/tailwind.css";
// 导入字体图标
import "./assets/iconfont/iconfont.js";
import "./assets/iconfont/iconfont.css";

const app = createApp(App);

// 先初始化 Element Plus
app.use(ElementPlus, {
  locale: zhCn
});

// 将 ECharts 挂载到全局
app.config.globalProperties.$echarts = echarts;

// 自定义指令
import * as directives from "./directives/index.js";
Object.keys(directives).forEach(key => {
  app.directive(key, (directives as { [key: string]: Directive })[key]);
});

// 全局注册@iconify/vue图标库
import {
  IconifyIconOffline,
  IconifyIconOnline,
  FontIcon
} from "./components/ReIcon/index.js";
app.component("IconifyIconOffline", IconifyIconOffline);
app.component("IconifyIconOnline", IconifyIconOnline);
app.component("FontIcon", FontIcon);

// 全局注册按钮级别权限组件
import { Auth } from "./components/ReAuth/index.js";
import { Perms } from "./components/RePerms/index.js";
app.component("Auth", Auth);
app.component("Perms", Perms);

// 全局注册vue-tippy
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
import VueTippy from "vue-tippy";
app.use(VueTippy);

getPlatformConfig(app).then(async config => {
  setupStore(app);
  app.use(router);
  await router.isReady();
  injectResponsiveStorage(app, config);
  app.use(MotionPlugin).use(Table);

  app.mount("#app");
});

// 导出 echarts 实例，以便在组件中使用
export { echarts };
