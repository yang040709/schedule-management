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
  },
})

const prodConfig = defineConfig({
  base: '/schedule-management',
})
const devConfig = defineConfig({
  base: '/',
})

let config

if (process.env.NODE_ENV === 'production') {
  config = mergeConfig(commonConfig, prodConfig)
} else {
  config = mergeConfig(commonConfig, devConfig)
}
export default config
