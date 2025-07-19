import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as blogApi from '@/api/blog'

export const useBlogStore = defineStore('blog', () => {
  // 状态
  const articles = ref([])
  const currentArticle = ref(null)
  const categories = ref([])
  const tags = ref([])
  const featuredArticles = ref([])
  const relatedArticles = ref([])
  
  // 分页信息
  const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  })
  
  // 筛选条件
  const filters = ref({
    categoryId: null,
    tagId: null,
    featured: null
  })
  
  // 计算属性
  const hasMore = computed(() => {
    return pagination.value.page < pagination.value.totalPages
  })
  
  const isEmpty = computed(() => {
    return articles.value.length === 0
  })
  
  // 动作
  async function fetchArticles(options = {}) {
    try {
      const params = {
        page: options.page || pagination.value.page,
        pageSize: options.pageSize || pagination.value.pageSize,
        ...filters.value,
        ...options
      }
      
      const response = await blogApi.getArticles(params)
      
      if (options.append) {
        articles.value.push(...response.data.list)
      } else {
        articles.value = response.data.list
      }
      
      pagination.value = response.data.pagination
      
      return response
    } catch (error) {
      console.error('获取文章列表失败:', error)
      throw error
    }
  }
  
  async function fetchArticleDetail(id) {
    try {
      const response = await blogApi.getArticleDetail(id)
      currentArticle.value = response.data.article
      relatedArticles.value = response.data.relatedArticles || []
      
      // 增加浏览量
      await blogApi.incrementArticleView(id)
      
      return response
    } catch (error) {
      console.error('获取文章详情失败:', error)
      throw error
    }
  }
  
  async function fetchCategories() {
    try {
      const response = await blogApi.getCategories()
      categories.value = response.data
      return response
    } catch (error) {
      console.error('获取分类列表失败:', error)
      throw error
    }
  }
  
  async function fetchTags() {
    try {
      const response = await blogApi.getTags()
      tags.value = response.data
      return response
    } catch (error) {
      console.error('获取标签列表失败:', error)
      throw error
    }
  }
  
  async function fetchFeaturedArticles(limit = 5) {
    try {
      const response = await blogApi.getFeaturedArticles(limit)
      featuredArticles.value = response.data
      return response
    } catch (error) {
      console.error('获取精选文章失败:', error)
      throw error
    }
  }
  
  async function loadMore() {
    if (!hasMore.value) return
    
    const nextPage = pagination.value.page + 1
    await fetchArticles({ page: nextPage, append: true })
  }
  
  function setFilter(key, value) {
    filters.value[key] = value
    pagination.value.page = 1
  }
  
  function clearFilters() {
    filters.value = {
      categoryId: null,
      tagId: null,
      featured: null
    }
    pagination.value.page = 1
  }
  
  function resetPagination() {
    pagination.value = {
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0
    }
  }
  
  function clearCurrentArticle() {
    currentArticle.value = null
    relatedArticles.value = []
  }
  
  return {
    // 状态
    articles,
    currentArticle,
    categories,
    tags,
    featuredArticles,
    relatedArticles,
    pagination,
    filters,
    
    // 计算属性
    hasMore,
    isEmpty,
    
    // 动作
    fetchArticles,
    fetchArticleDetail,
    fetchCategories,
    fetchTags,
    fetchFeaturedArticles,
    loadMore,
    setFilter,
    clearFilters,
    resetPagination,
    clearCurrentArticle
  }
})
