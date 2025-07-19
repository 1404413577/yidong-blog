import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 状态
  const isDark = ref(false)
  const isLoading = ref(false)
  const isMobileMenuOpen = ref(false)
  const loadingText = ref('加载中...')
  
  // 计算属性
  const theme = computed(() => isDark.value ? 'dark' : 'light')
  
  // 动作
  function toggleTheme() {
    isDark.value = !isDark.value
    updateTheme()
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }
  
  function setTheme(theme) {
    isDark.value = theme === 'dark'
    updateTheme()
    localStorage.setItem('theme', theme)
  }
  
  function updateTheme() {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  function initTheme() {
    // 从本地存储获取主题设置
    const savedTheme = localStorage.getItem('theme')
    
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      // 如果没有保存的主题，使用系统偏好
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    
    updateTheme()
  }
  
  function setLoading(loading, text = '加载中...') {
    isLoading.value = loading
    loadingText.value = text
  }
  
  function toggleMobileMenu() {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
  }
  
  function closeMobileMenu() {
    isMobileMenuOpen.value = false
  }
  
  return {
    // 状态
    isDark,
    isLoading,
    isMobileMenuOpen,
    loadingText,
    
    // 计算属性
    theme,
    
    // 动作
    toggleTheme,
    setTheme,
    initTheme,
    setLoading,
    toggleMobileMenu,
    closeMobileMenu
  }
})
