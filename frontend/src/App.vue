<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- 导航栏 -->
    <AppHeader />
    
    <!-- 主要内容区域 -->
    <main class="pt-16">
      <router-view v-slot="{ Component, route }">
        <transition
          :name="route.meta.transition || 'fade'"
          mode="out-in"
          appear
        >
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>
    
    <!-- 返回顶部按钮 -->
    <BackToTop />
    
    <!-- 全局加载指示器 -->
    <GlobalLoading v-if="isLoading" />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import AppHeader from '@/components/layout/AppHeader.vue'
import BackToTop from '@/components/common/BackToTop.vue'
import GlobalLoading from '@/components/common/GlobalLoading.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    BackToTop,
    GlobalLoading
  },
  setup() {
    const appStore = useAppStore()
    
    // 初始化主题
    appStore.initTheme()
    
    const isLoading = computed(() => appStore.isLoading)
    
    return {
      isLoading
    }
  }
}
</script>

<style>
/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(30px);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}
</style>
