<template>
  <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">文章列表</h1>
        <p class="text-gray-600 dark:text-gray-400">探索技术世界，分享编程心得</p>
      </div>
      
      <!-- 筛选器 -->
      <div class="mb-8">
        <div class="flex flex-wrap gap-4 items-center justify-between">
          <!-- 分类筛选 -->
          <div class="flex flex-wrap gap-2">
            <button
              @click="setFilter('categoryId', null)"
              class="filter-btn"
              :class="{ 'filter-btn-active': !filters.categoryId }"
            >
              全部
            </button>
            <button
              v-for="category in categories"
              :key="category.id"
              @click="setFilter('categoryId', category.id)"
              class="filter-btn"
              :class="{ 'filter-btn-active': filters.categoryId === category.id }"
            >
              {{ category.name }}
              <span class="ml-1 text-xs opacity-75">({{ category.article_count }})</span>
            </button>
          </div>
          
          <!-- 精选筛选 -->
          <div class="flex items-center space-x-2">
            <label class="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                :checked="filters.featured"
                @change="toggleFeatured"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300">仅显示精选</span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- 文章列表 -->
      <div v-if="!isEmpty">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <ArticleCard
            v-for="article in articles"
            :key="article.id"
            :article="article"
            class="animate-slide-up"
          />
        </div>
        
        <!-- 加载更多 -->
        <div class="text-center">
          <button
            v-if="hasMore"
            @click="loadMore"
            :disabled="isLoading"
            class="btn btn-primary px-8 py-3"
          >
            <span v-if="!isLoading">加载更多</span>
            <span v-else class="flex items-center">
              <div class="loading-spinner w-4 h-4 mr-2"></div>
              加载中...
            </span>
          </button>
          
          <p v-else-if="articles.length > 0" class="text-gray-500 dark:text-gray-400">
            已显示全部文章
          </p>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-else class="text-center py-16">
        <div class="text-gray-400 dark:text-gray-600 mb-4">
          <svg class="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">暂无文章</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">当前筛选条件下没有找到文章</p>
        <button @click="clearFilters" class="btn btn-primary">
          清除筛选条件
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, watch } from 'vue'
import { useBlogStore } from '@/stores/blog'
import { useAppStore } from '@/stores/app'
import ArticleCard from '@/components/blog/ArticleCard.vue'

export default {
  name: 'ArticleList',
  components: {
    ArticleCard
  },
  setup() {
    const blogStore = useBlogStore()
    const appStore = useAppStore()
    
    const articles = computed(() => blogStore.articles)
    const categories = computed(() => blogStore.categories)
    const filters = computed(() => blogStore.filters)
    const hasMore = computed(() => blogStore.hasMore)
    const isEmpty = computed(() => blogStore.isEmpty)
    const isLoading = computed(() => appStore.isLoading)
    
    const loadData = async () => {
      try {
        await Promise.all([
          blogStore.fetchArticles(),
          blogStore.fetchCategories()
        ])
      } catch (error) {
        console.error('加载文章列表失败:', error)
      }
    }
    
    const loadMore = async () => {
      try {
        await blogStore.loadMore()
      } catch (error) {
        console.error('加载更多文章失败:', error)
      }
    }
    
    const setFilter = async (key, value) => {
      blogStore.setFilter(key, value)
      await blogStore.fetchArticles()
    }
    
    const toggleFeatured = async (event) => {
      const featured = event.target.checked ? true : null
      blogStore.setFilter('featured', featured)
      await blogStore.fetchArticles()
    }
    
    const clearFilters = async () => {
      blogStore.clearFilters()
      await blogStore.fetchArticles()
    }
    
    // 监听路由查询参数
    watch(
      () => blogStore.filters,
      async () => {
        await blogStore.fetchArticles()
      },
      { deep: true }
    )
    
    onMounted(() => {
      loadData()
    })
    
    return {
      articles,
      categories,
      filters,
      hasMore,
      isEmpty,
      isLoading,
      loadMore,
      setFilter,
      toggleFeatured,
      clearFilters
    }
  }
}
</script>

<style scoped>
.filter-btn {
  @apply px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400;
}

.filter-btn-active {
  @apply bg-primary-600 text-white border-primary-600 hover:bg-primary-700 hover:border-primary-700 hover:text-white;
}
</style>
