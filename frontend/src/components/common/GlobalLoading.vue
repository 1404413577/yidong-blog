<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
    <div class="flex flex-col items-center space-y-4">
      <!-- 加载动画 -->
      <div class="relative">
        <div class="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin">
          <div class="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      </div>
      
      <!-- 加载文本 -->
      <p class="text-gray-600 dark:text-gray-400 font-medium">{{ loadingText }}</p>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

export default {
  name: 'GlobalLoading',
  setup() {
    const appStore = useAppStore()
    
    const loadingText = computed(() => appStore.loadingText)
    
    return {
      loadingText
    }
  }
}
</script>
