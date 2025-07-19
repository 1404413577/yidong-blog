<template>
  <div class="min-h-screen">
    <!-- 英雄区域 -->
    <section class="relative px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div class="max-w-4xl mx-auto text-center">
        <!-- 头像 -->
        <div class="mb-8 animate-bounce-in">
          <div class="flex items-center justify-center w-24 h-24 mx-auto rounded-full shadow-lg bg-gradient-to-br from-primary-500 to-purple-600">
            <span class="text-3xl font-bold text-white">明</span>
          </div>
        </div>
        
        <!-- 标题 -->
        <h1 class="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl dark:text-white animate-slide-up">
          <span class="text-gradient">ming</span>的个人博客
        </h1>
        
        <!-- 副标题 -->
        <p class="max-w-2xl mx-auto mb-8 text-xl text-gray-600 dark:text-gray-300 animate-slide-up" style="animation-delay: 0.1s">
          分享技术心得，记录成长足迹，探索编程世界的无限可能
        </p>
        
        <!-- 统计信息 -->
        <div class="flex justify-center mb-8 space-x-8 animate-slide-up" style="animation-delay: 0.2s">
          <div class="text-center">
            <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ stats.articles }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">文章</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ stats.categories }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">分类</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ stats.tags }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">标签</div>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="flex flex-col justify-center gap-4 sm:flex-row animate-slide-up" style="animation-delay: 0.3s">
          <router-link to="/articles" class="px-8 py-3 text-lg btn btn-primary">
            开始阅读
          </router-link>
          <router-link to="/about" class="px-8 py-3 text-lg btn btn-secondary">
            了解更多
          </router-link>
        </div>
      </div>
      
      <!-- 装饰元素 -->
      <div class="absolute w-20 h-20 rounded-full opacity-50 top-10 left-10 bg-primary-200 dark:bg-primary-800 animate-float"></div>
      <div class="absolute w-16 h-16 bg-purple-200 rounded-full opacity-50 bottom-10 right-10 dark:bg-purple-800 animate-float" style="animation-delay: 1s"></div>
    </section>
    
    <!-- 精选文章 -->
    <section class="px-4 py-16 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <div class="mb-12 text-center">
          <h2 class="mb-4 text-3xl font-bold text-gray-900 dark:text-white">精选文章</h2>
          <p class="text-gray-600 dark:text-gray-400">推荐阅读的优质内容</p>
        </div>
        
        <div v-if="featuredArticles.length > 0" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ArticleCard
            v-for="article in featuredArticles"
            :key="article.id"
            :article="article"
            class="animate-slide-up"
            :style="{ 'animation-delay': `${0.1 * featuredArticles.indexOf(article)}s` }"
          />
        </div>
        
        <div v-else class="py-12 text-center">
          <div class="mb-4 text-gray-400 dark:text-gray-600">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p class="text-gray-500 dark:text-gray-400">暂无精选文章</p>
        </div>
        
        <div class="mt-8 text-center">
          <router-link to="/articles" class="btn btn-primary">
            查看全部文章
          </router-link>
        </div>
      </div>
    </section>
    
    <!-- 最新文章 -->
    <section class="px-4 py-16 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div class="max-w-6xl mx-auto">
        <div class="mb-12 text-center">
          <h2 class="mb-4 text-3xl font-bold text-gray-900 dark:text-white">最新文章</h2>
          <p class="text-gray-600 dark:text-gray-400">最近发布的内容</p>
        </div>
        
        <div v-if="recentArticles.length > 0" class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ArticleCard
            v-for="article in recentArticles"
            :key="article.id"
            :article="article"
            :horizontal="true"
            class="animate-slide-up"
            :style="{ 'animation-delay': `${0.1 * recentArticles.indexOf(article)}s` }"
          />
        </div>
        
        <div v-else class="py-12 text-center">
          <div class="mb-4 text-gray-400 dark:text-gray-600">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p class="text-gray-500 dark:text-gray-400">暂无文章</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useBlogStore } from '@/stores/blog'
import ArticleCard from '@/components/blog/ArticleCard.vue'

export default {
  name: 'Home',
  components: {
    ArticleCard
  },
  setup() {
    const blogStore = useBlogStore()
    
    const recentArticles = ref([])
    
    const featuredArticles = computed(() => blogStore.featuredArticles)
    const categories = computed(() => blogStore.categories)
    const tags = computed(() => blogStore.tags)
    
    const stats = computed(() => ({
      articles: blogStore.articles.length || 0,
      categories: categories.value.length || 0,
      tags: tags.value.length || 0
    }))
    
    const loadData = async () => {
      try {
        // 并行加载数据
        await Promise.all([
          blogStore.fetchFeaturedArticles(6),
          blogStore.fetchCategories(),
          blogStore.fetchTags(),
          loadRecentArticles()
        ])
      } catch (error) {
        console.error('加载首页数据失败:', error)
      }
    }
    
    const loadRecentArticles = async () => {
      try {
        const response = await blogStore.fetchArticles({ pageSize: 4 })
        recentArticles.value = response.data.list
      } catch (error) {
        console.error('加载最新文章失败:', error)
      }
    }
    
    onMounted(() => {
      loadData()
    })
    
    return {
      featuredArticles,
      recentArticles,
      stats
    }
  }
}
</script>
