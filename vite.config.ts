import { fileURLToPath, URL } from 'node:url'

import { defineConfig, mergeConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { log } from 'node:console'
import { visualizer } from 'rollup-plugin-visualizer'
import { writeFile } from 'fs/promises'
import { Plugin as importToCDN } from 'vite-plugin-cdn-import'
// https://vite.dev/config/
const commonConfig = defineConfig({
  // base:"/schedule-management",
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    visualizer({ open: false }),
    importToCDN({
      modules: [
        // {
        //   name: 'vue',
        //   var: 'Vue',
        //   // path: 'https://cdn.bootcdn.net/ajax/libs/vue/3.5.22/vue.runtime.global.prod.min.js',
        //   path: 'https://cdn.bootcdn.net/ajax/libs/vue/3.5.22/vue.runtime.global.prod.js',
        // },
        // {
        //   name: 'vue-router',
        //   var: 'VueRouter',
        //   path: 'https://cdn.bootcdn.net/ajax/libs/vue-router/4.5.1/vue-router.global.prod.min.js',
        // },
        // {
        //   name: 'pinia',
        //   var: 'Pinia',
        //   path: 'https://cdn.bootcdn.net/ajax/libs/pinia/3.0.3/pinia.iife.prod.min.js',
        // },
        {
          name: 'axios',
          var: 'axios',
          path: 'https://cdn.bootcdn.net/ajax/libs/axios/1.8.4/axios.min.js',
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 9463,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // writeFile('log.txt', id + '\n', { flag: 'a' })
          if (!id.includes('node_modules')) {
            return
          }
          // 使用正则匹配，确保兼容 Windows (\) 和 Unix (/) 路径分隔符
          const pathSep = '[/\\\\]' // 匹配 / 或 \
          if (new RegExp(`${pathSep}zod${pathSep}`).test(id)) {
            return 'zod'
          }
          if (new RegExp(`${pathSep}axios${pathSep}`).test(id)) {
            return 'axios'
          }
          if (new RegExp(`${pathSep}(echarts|zrender|tslib)${pathSep}`).test(id)) {
            return 'echarts'
          }
          if (new RegExp(`${pathSep}reka-ui${pathSep}`).test(id)) {
            return 'reka-ui'
          }
          if (new RegExp(`${pathSep}@vue-flow${pathSep}`).test(id)) {
            return 'vue-flow'
          }
          if (new RegExp(`${pathSep}lodash-es${pathSep}`).test(id)) {
            return 'lodash-es'
          }
          // if (new RegExp(`${pathSep}zrender${pathSep}`).test(id)) {
          //   return 'zrender'
          // }
          // 注意我们使用了cdn加速，所以不需要打包vue相关的包
          // 本来想按上面这样做的，但是浏览器版本的vue无法使用内置组件teleport
          // // 注意：vue 相关包需放在最后，避免被其他更具体的匹配提前捕获
          if (new RegExp(`${pathSep}(vue|vue-router|pinia)${pathSep}`).test(id)) {
            return 'vue'
          }
          // 其他未明确指定的第三方依赖归入 vendor
          return 'vendor'
        },
      },
    },
  },
  preview: {
    port: 4173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})

const prodConfig = defineConfig({
  // base: '/schedule-management',
  base: '/',
})
const devConfig = defineConfig({
  base: '/',
})

let config = commonConfig

if (process.env.NODE_ENV === 'production') {
  config = mergeConfig(commonConfig, prodConfig)
} else {
  config = mergeConfig(commonConfig, devConfig)
}
export default config
