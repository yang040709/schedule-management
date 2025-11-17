import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './index.css'
import App from './App.vue'
import router from './router'
import { setDirectives } from '@/plugins/directives'

const app = createApp(App)
setDirectives(app)
app.use(createPinia())
app.use(router)
app.mount('#app')
