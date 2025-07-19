<template>
  <div class="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="text-center">
      <!-- 404 图标 -->
      <div class="mb-8 animate-bounce-in">
        <div class="text-9xl font-bold text-primary-600 dark:text-primary-400 mb-4">404</div>
        <div class="w-24 h-24 mx-auto bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-float">
          <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </div>
      
      <!-- 错误信息 -->
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-slide-up">
        页面不存在
      </h1>
      
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto animate-slide-up" style="animation-delay: 0.1s">
        抱歉，您访问的页面不存在或已被移动。
      </p>
      
      <!-- 操作按钮 -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style="animation-delay: 0.2s">
        <router-link to="/" class="btn btn-primary px-8 py-3">
          返回首页
        </router-link>
        <button @click="$router.go(-1)" class="btn btn-secondary px-8 py-3">
          返回上页
        </button>
      </div>
      
      <!-- 推荐链接 -->
      <div class="mt-12 animate-slide-up" style="animation-delay: 0.3s">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">或者访问这些页面</h2>
        <div class="flex flex-wrap justify-center gap-4">
          <router-link 
            v-for="link in quickLinks" 
            :key="link.name"
            :to="link.path" 
            class="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200"
          >
            <component :is="link.icon" class="w-4 h-4 mr-2" />
            {{ link.name }}
          </router-link>
        </div>
      </div>
      
      <!-- 装饰元素 -->
      <div class="absolute top-20 left-20 w-16 h-16 bg-primary-200 dark:bg-primary-800 rounded-full opacity-50 animate-float"></div>
      <div class="absolute bottom-20 right-20 w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full opacity-50 animate-float" style="animation-delay: 1s"></div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'NotFound',
  setup() {
    const quickLinks = ref([
      {
        name: '首页',
        path: '/',
        icon: 'HomeIcon'
      },
      {
        name: '文章',
        path: '/articles',
        icon: 'DocumentTextIcon'
      },
      {
        name: '关于',
        path: '/about',
        icon: 'UserIcon'
      }
    ])
    
    return {
      quickLinks
    }
  },
  components: {
    HomeIcon: {
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      `
    },
    DocumentTextIcon: {
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      `
    },
    UserIcon: {
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      `
    }
  }
}
</script>
