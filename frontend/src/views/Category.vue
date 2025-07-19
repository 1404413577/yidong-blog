<template>
  <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- 分类信息 -->
      <div v-if="category" class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {{ category.name }}
        </h1>
        <p v-if="category.description" class="text-xl text-gray-600 dark:text-gray-400 mb-6">
          {{ category.description }}
        </p>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          共 {{ pagination.total }} 篇文章
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
        <p class="text-gray-500 dark:text-gray-400 mb-6">该分类下还没有文章</p>
        <router-link to="/articles" class="btn btn-primary">
          浏览全部文章
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import * as blogApi from '@/api/blog'
import ArticleCard from '@/components/blog/ArticleCard.vue'

export default {
  name: 'Category',
  components: {
    ArticleCard
  },
  setup() {
    const route = useRoute()
    const appStore = useAppStore()
    
    const category = ref(null)
    const articles = ref([])
    const pagination = ref({
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0
    })
    
    const hasMore = computed(() => pagination.value.page < pagination.value.totalPages)
    const isEmpty = computed(() => articles.value.length === 0)
    const isLoading = computed(() => appStore.isLoading)
    
    const loadCategory = async (id) => {
      try {
        const response = await blogApi.getCategoryDetail(id)
        category.value = response.data
      } catch (error) {
        console.error('加载分类信息失败:', error)
      }
    }
    
    const loadArticles = async (id, page = 1, append = false) => {
      try {
        const response = await blogApi.getCategoryArticles(id, {
          page,
          pageSize: pagination.value.pageSize
        })
        
        if (append) {
          articles.value.push(...response.data.list)
        } else {
          articles.value = response.data.list
        }
        
        pagination.value = response.data.pagination
      } catch (error) {
        console.error('加载分类文章失败:', error)
      }
    }
    
    const loadMore = async () => {
      if (!hasMore.value) return
      
      const categoryId = parseInt(route.params.id)
      const nextPage = pagination.value.page + 1
      await loadArticles(categoryId, nextPage, true)
    }
    
    const loadData = async (id) => {
      await Promise.all([
        loadCategory(id),
        loadArticles(id)
      ])
    }
    
    // 监听路由变化
    watch(
      () => route.params.id,
      (newId) => {
        if (newId) {
          const categoryId = parseInt(newId)
          loadData(categoryId)
        }
      },
      { immediate: true }
    )
    
    onMounted(() => {
      const categoryId = parseInt(route.params.id)
      if (categoryId) {
        loadData(categoryId)
      }
    })
    
    return {
      category,
      articles,
      pagination,
      hasMore,
      isEmpty,
      isLoading,
      loadMore
    }
  }
}
</script>
