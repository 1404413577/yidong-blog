<template>
  <header class="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 glass dark:border-gray-700">
    <nav class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 lg:h-18">
        <!-- Logo -->
        <router-link 
          to="/" 
          class="flex items-center space-x-2 text-xl font-bold transition-transform duration-200 text-gradient hover:scale-105"
        >
          <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600">
            <span class="text-sm font-bold text-white">Y</span>
          </div>
          <span class="hidden sm:block">ming博客</span>
        </router-link>
        
        <!-- 桌面端导航 -->
        <div class="items-center hidden space-x-10 md:flex">
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
        <div class="flex items-center space-x-6">
          <!-- 用户菜单 -->
          <div v-if="authStore.isAuthenticated" class="items-center hidden space-x-6 md:flex">
            <!-- 管理后台入口 -->
            <router-link
              to="/admin"
              class="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
            >
              管理后台
            </router-link>

            <!-- 用户信息下拉菜单 -->
            <div class="relative" @click="toggleUserMenu" ref="userMenuRef">
              <button class="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <img
                  v-if="authStore.user?.avatar"
                  :src="getAvatarUrl(authStore.user.avatar)"
                  :alt="authStore.user.nickname"
                  class="object-cover w-8 h-8 rounded-full"
                />
                <div
                  v-else
                  class="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full dark:bg-gray-600"
                >
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ authStore.user?.nickname?.charAt(0) || 'U' }}
                  </span>
                </div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300 hidden lg:block">
                  {{ authStore.user?.nickname }}
                </span>
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <!-- 下拉菜单 -->
              <div
                v-show="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
              >
                <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ authStore.user?.nickname }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ authStore.user?.email }}</p>
                </div>
                <button
                  @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  退出登录
                </button>
              </div>
            </div>
          </div>

          <!-- 登录按钮 -->
          <router-link
            v-else
            to="/login"
            class="items-center hidden px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-blue-600 border border-transparent rounded-lg md:inline-flex hover:bg-blue-700 shadow-sm"
          >
            登录
          </router-link>

          <!-- 主题切换 -->
          <button
            @click="toggleTheme"
            class="p-2.5 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
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
            class="p-2 transition-colors duration-200 rounded-lg md:hidden hover:bg-gray-100 dark:hover:bg-gray-800"
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
        <div v-if="isMobileMenuOpen" class="py-4 border-t border-gray-200 md:hidden dark:border-gray-700">
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
            <div v-if="authStore.isAuthenticated" class="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center px-4 py-2">
                <img
                  v-if="authStore.user?.avatar"
                  :src="getAvatarUrl(authStore.user.avatar)"
                  :alt="authStore.user.nickname"
                  class="object-cover w-8 h-8 mr-3 rounded-full"
                />
                <div
                  v-else
                  class="flex items-center justify-center w-8 h-8 mr-3 bg-gray-300 rounded-full dark:bg-gray-600"
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
                class="w-full text-left text-red-600 mobile-nav-link dark:text-red-400"
              >
                退出登录
              </button>
            </div>

            <!-- 移动端登录按钮 -->
            <router-link
              v-else
              to="/login"
              class="font-semibold text-blue-600 mobile-nav-link dark:text-blue-400"
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
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { getAvatarUrl } from '@/utils/url'

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

    // 用户菜单状态
    const showUserMenu = ref(false)
    const userMenuRef = ref(null)

    const toggleTheme = () => {
      appStore.toggleTheme()
    }

    const toggleMobileMenu = () => {
      appStore.toggleMobileMenu()
    }

    const closeMobileMenu = () => {
      appStore.closeMobileMenu()
    }

    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value
    }

    const closeUserMenu = () => {
      showUserMenu.value = false
    }

    const handleLogout = async () => {
      await authStore.logout()
      closeMobileMenu()
      closeUserMenu()
      router.push('/')
    }

    // 点击外部关闭用户菜单
    const handleClickOutside = (event) => {
      if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
        closeUserMenu()
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      navItems,
      isDark,
      isMobileMenuOpen,
      showUserMenu,
      userMenuRef,
      authStore,
      toggleTheme,
      toggleMobileMenu,
      closeMobileMenu,
      toggleUserMenu,
      closeUserMenu,
      handleLogout,
      getAvatarUrl
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
