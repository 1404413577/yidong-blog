import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import axios from 'axios'

// 样式文件
import './styles/main.css'

// 代码高亮样式
import 'highlight.js/styles/github-dark.css'

// 配置axios默认设置
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
axios.defaults.timeout = 10000

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 初始化认证状态
import { useAuthStore } from './stores/auth'
const authStore = useAuthStore()
authStore.initAuth()

app.mount('#app')
