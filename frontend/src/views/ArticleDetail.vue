<template>
  <div v-if="article" class="min-h-screen">
    <!-- 文章头部 -->
    <header class="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div class="max-w-4xl mx-auto">
        <!-- 返回按钮 -->
        <button
          @click="$router.go(-1)"
          class="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-6 transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回
        </button>
        
        <!-- 文章信息 -->
        <div class="mb-6">
          <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <!-- 分类 -->
            <span v-if="article.category_name" class="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
              {{ article.category_name }}
            </span>
            
            <!-- 发布时间 -->
            <time :datetime="article.created_at">
              {{ formatDateTime(article.created_at) }}
            </time>
            
            <!-- 精选标识 -->
            <span v-if="article.is_featured" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              精选
            </span>
          </div>
          
          <!-- 标题 -->
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {{ article.title }}
          </h1>
          
          <!-- 摘要 -->
          <p v-if="article.summary" class="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            {{ article.summary }}
          </p>
        </div>
        
        <!-- 统计信息 -->
        <div class="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {{ formatNumber(article.view_count || 0) }} 次阅读
          </span>
          
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {{ formatNumber(article.like_count || 0) }} 次点赞
          </span>
          
          <span v-if="article.updated_at !== article.created_at">
            更新于 {{ formatDateTime(article.updated_at) }}
          </span>
        </div>
      </div>
    </header>
    
    <!-- 文章内容 -->
    <main class="py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- 文章正文 -->
          <article class="lg:col-span-3">
            <!-- 封面图片 -->
            <div v-if="article.cover_image" class="mb-8">
              <img 
                :src="article.cover_image" 
                :alt="article.title"
                class="w-full h-64 sm:h-80 object-cover rounded-xl shadow-lg"
              />
            </div>
            
            <!-- Markdown 内容 -->
            <div 
              class="markdown-content prose prose-lg max-w-none"
              v-html="renderedContent"
            ></div>
            
            <!-- 标签 -->
            <div v-if="article.tags && article.tags.length > 0" class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">标签</h3>
              <div class="flex flex-wrap gap-2">
                <router-link
                  v-for="tag in article.tags"
                  :key="tag.id"
                  :to="`/tags/${tag.id}`"
                  class="tag hover:opacity-80 transition-opacity duration-200"
                  :style="{ backgroundColor: tag.color + '20', color: tag.color }"
                >
                  {{ tag.name }}
                </router-link>
              </div>
            </div>
          </article>
          
          <!-- 侧边栏 -->
          <aside class="lg:col-span-1">
            <!-- 目录 -->
            <div v-if="toc.length > 0" class="card p-6 mb-6 sticky top-24">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">目录</h3>
              <nav class="space-y-2">
                <a
                  v-for="item in toc"
                  :key="item.anchor"
                  :href="`#${item.anchor}`"
                  class="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  :class="`ml-${(item.level - 1) * 4}`"
                >
                  {{ item.content }}
                </a>
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </main>
    
    <!-- 相关文章 -->
    <section v-if="relatedArticles.length > 0" class="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">相关文章</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ArticleCard
            v-for="article in relatedArticles"
            :key="article.id"
            :article="article"
          />
        </div>
      </div>
    </section>
  </div>
  
  <!-- 加载状态 -->
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="loading-spinner w-12 h-12 mx-auto mb-4"></div>
      <p class="text-gray-600 dark:text-gray-400">加载中...</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useBlogStore } from '@/stores/blog'
import { renderMarkdown, generateToc } from '@/utils/markdown'
import { formatDateTime } from '@/utils/date'
import { formatNumber } from '@/utils'
import ArticleCard from '@/components/blog/ArticleCard.vue'

export default {
  name: 'ArticleDetail',
  components: {
    ArticleCard
  },
  setup() {
    const route = useRoute()
    const blogStore = useBlogStore()
    
    const toc = ref([])
    
    const article = computed(() => blogStore.currentArticle)
    const relatedArticles = computed(() => blogStore.relatedArticles)
    
    const renderedContent = computed(() => {
      if (!article.value?.content) return ''
      return renderMarkdown(article.value.content)
    })
    
    const loadArticle = async (id) => {
      try {
        await blogStore.fetchArticleDetail(id)
        
        // 生成目录
        if (article.value?.content) {
          toc.value = generateToc(article.value.content)
        }
        
        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } catch (error) {
        console.error('加载文章详情失败:', error)
        // 可以跳转到404页面
      }
    }
    
    // 监听路由变化
    watch(
      () => route.params.id,
      (newId) => {
        if (newId) {
          loadArticle(parseInt(newId))
        }
      },
      { immediate: true }
    )
    
    onMounted(() => {
      const articleId = parseInt(route.params.id)
      if (articleId) {
        loadArticle(articleId)
      }
    })
    
    return {
      article,
      relatedArticles,
      renderedContent,
      toc,
      formatDateTime,
      formatNumber
    }
  }
}
</script>

<style>
/* 目录缩进样式 */
.ml-0 { margin-left: 0; }
.ml-4 { margin-left: 1rem; }
.ml-8 { margin-left: 2rem; }
.ml-12 { margin-left: 3rem; }
.ml-16 { margin-left: 4rem; }
.ml-20 { margin-left: 5rem; }
</style>
