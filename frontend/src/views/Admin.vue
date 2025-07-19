<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 顶部导航栏 -->
    <nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
              管理后台
            </h1>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- 侧边栏和主内容 -->
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- 侧边栏 -->
        <div class="lg:w-64 flex-shrink-0">
          <nav class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <ul class="space-y-2">
              <li>
                <button
                  @click="activeTab = 'dashboard'"
                  :class="[
                    'w-full text-left px-3 py-2 rounded-md text-sm font-medium',
                    activeTab === 'dashboard'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  ]"
                >
                  📊 仪表板
                </button>
              </li>
              <li>
                <button
                  @click="activeTab = 'articles'"
                  :class="[
                    'w-full text-left px-3 py-2 rounded-md text-sm font-medium',
                    activeTab === 'articles'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  ]"
                >
                  📝 文章管理
                </button>
              </li>
              <li>
                <button
                  @click="activeTab = 'categories'"
                  :class="[
                    'w-full text-left px-3 py-2 rounded-md text-sm font-medium',
                    activeTab === 'categories'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  ]"
                >
                  📂 分类管理
                </button>
              </li>
              <li>
                <button
                  @click="activeTab = 'tags'"
                  :class="[
                    'w-full text-left px-3 py-2 rounded-md text-sm font-medium',
                    activeTab === 'tags'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  ]"
                >
                  🏷️ 标签管理
                </button>
              </li>
              <li>
                <button
                  @click="activeTab = 'profile'"
                  :class="[
                    'w-full text-left px-3 py-2 rounded-md text-sm font-medium',
                    activeTab === 'profile'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  ]"
                >
                  👤 个人设置
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <!-- 主内容区域 -->
        <div class="flex-1">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
            <!-- 仪表板 -->
            <AdminDashboard v-if="activeTab === 'dashboard'" />
            
            <!-- 文章管理 -->
            <AdminArticles v-else-if="activeTab === 'articles'" />
            
            <!-- 分类管理 -->
            <AdminCategories v-else-if="activeTab === 'categories'" />
            
            <!-- 标签管理 -->
            <AdminTags v-else-if="activeTab === 'tags'" />
            
            <!-- 个人设置 -->
            <AdminProfile v-else-if="activeTab === 'profile'" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AdminDashboard from '../components/admin/AdminDashboard.vue'
import AdminArticles from '../components/admin/AdminArticles.vue'
import AdminCategories from '../components/admin/AdminCategories.vue'
import AdminTags from '../components/admin/AdminTags.vue'
import AdminProfile from '../components/admin/AdminProfile.vue'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('dashboard')

onMounted(async () => {
  // 确保用户已登录
  // 由于所有注册用户都是管理员，只需要检查登录状态
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
})
</script>
