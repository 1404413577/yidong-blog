import axios from 'axios'
import { useAppStore } from '@/stores/app'

// 创建axios实例
const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 显示加载状态
    const appStore = useAppStore()
    appStore.setLoading(true)
    
    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 隐藏加载状态
    const appStore = useAppStore()
    appStore.setLoading(false)
    
    const { data } = response
    
    // 检查业务状态码
    if (data.code !== 200) {
      console.error('业务错误:', data.message)
      return Promise.reject(new Error(data.message || '请求失败'))
    }
    
    return data
  },
  (error) => {
    // 隐藏加载状态
    const appStore = useAppStore()
    appStore.setLoading(false)
    
    let message = '网络错误'
    
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 400:
          message = data.message || '请求参数错误'
          break
        case 401:
          message = '未授权访问'
          break
        case 403:
          message = '禁止访问'
          break
        case 404:
          message = '资源不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = data.message || `请求失败 (${status})`
      }
    } else if (error.request) {
      message = '网络连接失败'
    } else {
      message = error.message || '请求配置错误'
    }
    
    console.error('响应错误:', message)
    return Promise.reject(new Error(message))
  }
)

export default request
