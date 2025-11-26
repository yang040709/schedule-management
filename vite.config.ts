import { fileURLToPath, URL } from 'node:url'

import { defineConfig, mergeConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { log } from 'node:console'
// https://vite.dev/config/
const commonConfig = defineConfig({
  // base:"/schedule-management",
  plugins: [vue(), vueDevTools(), tailwindcss()],
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
