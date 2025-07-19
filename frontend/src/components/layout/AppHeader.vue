<template>
  <header class="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200 dark:border-gray-700">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <router-link 
          to="/" 
          class="flex items-center space-x-2 text-xl font-bold text-gradient hover:scale-105 transition-transform duration-200"
        >
          <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">Y</span>
          </div>
          <span class="hidden sm:block">易东博客</span>
        </router-link>
        
        <!-- 桌面端导航 -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="item.path"
            class="nav-link"
            :class="{ 'nav-link-active': $route.path === item.path }"
          >
            {{ item.name }}
          </router-link>
        </div>
        
        <!-- 右侧操作 -->
        <div class="flex items-center space-x-4">
          <!-- 用户菜单 -->
          <div v-if="authStore.isAuthenticated" class="hidden md:flex items-center space-x-3">
            <!-- 用户头像和信息 -->
            <div class="flex items-center space-x-2">
              <img
                v-if="authStore.user?.avatar"
                :src="authStore.user.avatar"
                :alt="authStore.user.nickname"
                class="h-8 w-8 rounded-full object-cover"
              />
              <div
                v-else
                class="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center"
              >
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ authStore.user?.nickname?.charAt(0) || 'U' }}
                </span>
              </div>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ authStore.user?.nickname }}
              </span>
            </div>

            <!-- 管理后台入口 -->
            <!-- 由于所有用户都是管理员，直接显示管理后台入口 -->
            <router-link
              to="/admin"
              class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
            >
              管理后台
            </router-link>

            <!-- 登出按钮 -->
            <button
              @click="handleLogout"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-medium"
            >
              退出
            </button>
          </div>

          <!-- 登录按钮 -->
          <router-link
            v-else
            to="/login"
            class="hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            登录
          </router-link>

          <!-- 主题切换 -->
          <button
            @click="toggleTheme"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
          >
            <svg v-if="isDark" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
            </svg>
            <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          </button>

          <!-- 移动端菜单按钮 -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- 移动端菜单 -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div v-if="isMobileMenuOpen" class="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-col space-y-2">
            <router-link
              v-for="item in navItems"
              :key="item.name"
              :to="item.path"
              class="mobile-nav-link"
              :class="{ 'mobile-nav-link-active': $route.path === item.path }"
              @click="closeMobileMenu"
            >
              {{ item.name }}
            </router-link>

            <!-- 移动端用户菜单 -->
            <div v-if="authStore.isAuthenticated" class="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
              <div class="flex items-center px-4 py-2">
                <img
                  v-if="authStore.user?.avatar"
                  :src="authStore.user.avatar"
                  :alt="authStore.user.nickname"
                  class="h-8 w-8 rounded-full object-cover mr-3"
                />
                <div
                  v-else
                  class="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mr-3"
                >
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ authStore.user?.nickname?.charAt(0) || 'U' }}
                  </span>
                </div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ authStore.user?.nickname }}
                </span>
              </div>

              <!-- 由于所有用户都是管理员，直接显示管理后台入口 -->
              <router-link
                to="/admin"
                class="mobile-nav-link"
                @click="closeMobileMenu"
              >
                管理后台
              </router-link>

              <button
                @click="handleLogout"
                class="w-full text-left mobile-nav-link text-red-600 dark:text-red-400"
              >
                退出登录
              </button>
            </div>

            <!-- 移动端登录按钮 -->
            <router-link
              v-else
              to="/login"
              class="mobile-nav-link text-blue-600 dark:text-blue-400 font-semibold"
              @click="closeMobileMenu"
            >
              登录
            </router-link>
          </div>
        </div>
      </transition>
    </nav>
  </header>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'AppHeader',
  setup() {
    const router = useRouter()
    const appStore = useAppStore()
    const authStore = useAuthStore()

    const navItems = [
      { name: '首页', path: '/' },
      { name: '文章', path: '/articles' },
      { name: '关于', path: '/about' }
    ]

    const isDark = computed(() => appStore.isDark)
    const isMobileMenuOpen = computed(() => appStore.isMobileMenuOpen)

    const toggleTheme = () => {
      appStore.toggleTheme()
    }

    const toggleMobileMenu = () => {
      appStore.toggleMobileMenu()
    }

    const closeMobileMenu = () => {
      appStore.closeMobileMenu()
    }

    const handleLogout = async () => {
      await authStore.logout()
      closeMobileMenu()
      router.push('/')
    }

    return {
      navItems,
      isDark,
      isMobileMenuOpen,
      authStore,
      toggleTheme,
      toggleMobileMenu,
      closeMobileMenu,
      handleLogout
    }
  }
}
</script>

<style scoped>
.nav-link {
  @apply text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-200 relative;
}

.nav-link-active {
  @apply text-primary-600 dark:text-primary-400;
}

.nav-link-active::after {
  content: '';
  @apply absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full;
}

.mobile-nav-link {
  @apply block px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium transition-all duration-200;
}

.mobile-nav-link-active {
  @apply text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20;
}
</style>
