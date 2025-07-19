<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">文章管理</h2>
      <button
        @click="showCreateModal = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
      >
        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        新建文章
      </button>
    </div>

    <!-- 筛选器 -->
    <div class="mb-6 flex flex-wrap gap-4">
      <select
        v-model="filters.status"
        @change="fetchArticles"
        class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
      >
        <option value="">所有状态</option>
        <option value="published">已发布</option>
        <option value="draft">草稿</option>
      </select>
      
      <input
        v-model="filters.keyword"
        @input="debounceSearch"
        placeholder="搜索文章..."
        class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
      />
    </div>

    <!-- 文章列表 -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="articles.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">暂无文章</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">开始创建你的第一篇文章吧！</p>
    </div>

    <div v-else class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
      <ul class="divide-y divide-gray-200 dark:divide-gray-700">
        <li v-for="article in articles" :key="article.id" class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white truncate">
                  {{ article.title }}
                </h3>
                <span
                  v-if="article.is_featured"
                  class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                >
                  精选
                </span>
              </div>
              <div class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>{{ formatDate(article.created_at) }}</span>
                <span class="mx-2">•</span>
                <span>{{ article.view_count }} 次浏览</span>
                <span class="mx-2">•</span>
                <span>{{ article.category_name || '未分类' }}</span>
                <span class="mx-2">•</span>
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
              <p v-if="article.summary" class="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {{ article.summary }}
              </p>
            </div>
            
            <div class="ml-4 flex items-center space-x-2">
              <button
                @click="editArticle(article)"
                class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                编辑
              </button>
              <button
                @click="deleteArticle(article)"
                class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                删除
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- 分页 -->
    <div v-if="pagination.totalPages > 1" class="mt-6 flex justify-center">
      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
        <button
          @click="changePage(pagination.page - 1)"
          :disabled="pagination.page <= 1"
          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
        >
          上一页
        </button>
        
        <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ pagination.page }} / {{ pagination.totalPages }}
        </span>
        
        <button
          @click="changePage(pagination.page + 1)"
          :disabled="pagination.page >= pagination.totalPages"
          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
        >
          下一页
        </button>
      </nav>
    </div>

    <!-- 创建/编辑文章模态框 -->
    <ArticleModal
      v-if="showCreateModal || showEditModal"
      :article="editingArticle"
      :is-edit="showEditModal"
      @close="closeModal"
      @saved="handleArticleSaved"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import ArticleModal from './ArticleModal.vue'

const isLoading = ref(false)
const articles = ref([])
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0
})

const filters = reactive({
  status: '',
  keyword: ''
})

const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingArticle = ref(null)

let searchTimeout = null

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchArticles()
  }, 500)
}

const fetchArticles = async () => {
  try {
    isLoading.value = true
    const params = {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      ...filters
    }
    
    const response = await axios.get('/api/admin/articles', { params })
    
    if (response.data.success) {
      articles.value = response.data.data.articles
      pagination.value = response.data.data.pagination
    }
  } catch (error) {
    console.error('获取文章列表失败:', error)
  } finally {
    isLoading.value = false
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.page = page
    fetchArticles()
  }
}

const editArticle = (article) => {
  editingArticle.value = article
  showEditModal.value = true
}

const deleteArticle = async (article) => {
  if (!confirm(`确定要删除文章"${article.title}"吗？`)) {
    return
  }
  
  try {
    const response = await axios.delete(`/api/admin/articles/${article.id}`)
    if (response.data.success) {
      fetchArticles()
    }
  } catch (error) {
    console.error('删除文章失败:', error)
    alert('删除失败，请稍后重试')
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingArticle.value = null
}

const handleArticleSaved = () => {
  closeModal()
  fetchArticles()
}

onMounted(() => {
  fetchArticles()
})
</script>
