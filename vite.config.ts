import { getPluginsList } from "./build/plugins";
import { include, exclude } from "./build/optimize";
import { type UserConfigExport, type ConfigEnv, loadEnv } from "vite";
import { fileURLToPath } from "url";
import { root, wrapperEnv, pathResolve, __APP_INFO__ } from "./build/utils";
export default ({ mode }: ConfigEnv): UserConfigExport => {
  const { VITE_CDN, VITE_PORT, VITE_COMPRESSION, VITE_PUBLIC_PATH } =
    wrapperEnv(loadEnv(mode, root));
  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url))
      }
    },
    // 服务端渲染
    server: {
      // 端口号
      port: VITE_PORT,
      host: "0.0.0.0",
      // 本地跨域代理 https://cn.vitejs.dev/config/server-options.html#server-proxy
      proxy: {
        "/api": {
          target: "http://127.0.0.1:3000",
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, "")
        },
        "/api/stock": {
          target: "https://stock.gtimg.cn",
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api\/stock/, "")
        },
        "/openlibrary": {
          target: "https://openlibrary.org",
          changeOrigin: true,
          rewrite: path => path.replace(/^\/openlibrary/, ""),
          timeout: 30000,
          headers: {
            Accept: "application/json",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
          }
        },
        "/gutendex": {
          target: "http://gutendex.com",
          changeOrigin: true,
          rewrite: path => path.replace(/^\/gutendex/, ""),
          timeout: 30000,
          headers: {
            Accept: "application/json",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
          }
        },
        "/arxiv": {
          target: "http://export.arxiv.org",
          changeOrigin: true,
          rewrite: path => path.replace(/^\/arxiv/, ""),
          timeout: 30000,
          headers: {
            Accept: "application/xml",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
          }
        }
      },
      // 预热文件以提前转换和缓存结果，降低启动期间的初始页面加载时长并防止转换瀑布
      warmup: {
        clientFiles: ["./index.html", "./src/{views,components}/*"]
      }
    },
    plugins: getPluginsList(VITE_CDN, VITE_COMPRESSION),
    // https://cn.vitejs.dev/config/dep-optimization-options.html#dep-optimization-options
    optimizeDeps: {
      include,
      exclude
    },
    build: {
      // https://cn.vitejs.dev/guide/build.html#browser-compatibility
      target: "es2015",
      sourcemap: false,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        input: {
          index: pathResolve("./index.html", import.meta.url)
        },
        // 静态资源分类打包
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]"
        }
      },
      // 输出目录
      outDir: "dist",

      // 静态资源处理
      assetsDir: "assets",

      // 生产环境移除 console
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    },
    define: {
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    }
  };
};
