<template>
  <div class="p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">仪表板</h2>
      <p class="text-gray-600 dark:text-gray-400">欢迎回来，{{ authStore.user?.nickname }}！</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- 统计卡片 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <div class="text-2xl font-bold">{{ stats.articles?.total || 0 }}</div>
            <div class="text-blue-100">总文章数</div>
          </div>
        </div>
        <div class="mt-4 text-sm text-blue-100">
          已发布: {{ stats.articles?.published || 0 }} | 草稿: {{ stats.articles?.draft || 0 }}
        </div>
      </div>

      <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <div class="text-2xl font-bold">{{ stats.views?.total || 0 }}</div>
            <div class="text-green-100">总浏览量</div>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <div class="text-2xl font-bold">{{ stats.categories || 0 }}</div>
            <div class="text-purple-100">分类数量</div>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <div class="text-2xl font-bold">{{ stats.tags || 0 }}</div>
            <div class="text-orange-100">标签数量</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近文章 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 最近文章列表 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">最近文章</h3>
        <div v-if="recentArticles.length === 0" class="text-gray-500 dark:text-gray-400 text-center py-8">
          暂无文章
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="article in recentArticles"
            :key="article.id"
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div class="flex-1">
              <h4 class="font-medium text-gray-900 dark:text-white truncate">
                {{ article.title }}
              </h4>
              <div class="flex items-center space-x-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                <span>{{ formatDate(article.created_at) }}</span>
                <span>{{ article.view_count }} 次浏览</span>
                <span
                  :class="[
                    'px-2 py-1 rounded-full text-xs',
                    article.status === 'published'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  ]"
                >
                  {{ article.status === 'published' ? '已发布' : '草稿' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 快速操作 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">快速操作</h3>
        <div class="space-y-3">
          <button
            @click="$emit('switch-tab', 'articles')"
            class="w-full flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
          >
            <div class="flex items-center">
              <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              写新文章
            </div>
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          <button
            @click="$emit('switch-tab', 'categories')"
            class="w-full flex items-center justify-between p-3 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg hover:bg-green-100 dark:hover:bg-green-800 transition-colors"
          >
            <div class="flex items-center">
              <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
              管理分类
            </div>
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          <button
            @click="$emit('switch-tab', 'tags')"
            class="w-full flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-200 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors"
          >
            <div class="flex items-center">
              <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
              管理标签
            </div>
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { getDashboardStats, getAdminArticles } from '@/api/admin'

const authStore = useAuthStore()

const isLoading = ref(true)
const stats = ref({})
const recentArticles = ref([])

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const fetchDashboardData = async () => {
  try {
    isLoading.value = true

    // 获取统计数据
    const [statsResponse, articlesResponse] = await Promise.all([
      getDashboardStats(),
      getAdminArticles({ page: 1, pageSize: 5 })
    ])

    if (statsResponse.code === 200) {
      stats.value = statsResponse.data
    }

    if (articlesResponse.code === 200) {
      recentArticles.value = articlesResponse.data.articles
    }
  } catch (error) {
    console.error('获取仪表板数据失败:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>
