<template>
  <article 
    class="card card-hover group cursor-pointer overflow-hidden"
    :class="{ 'flex': horizontal }"
    @click="goToArticle"
  >
    <!-- 封面图片 -->
    <div 
      v-if="article.cover_image" 
      class="relative overflow-hidden"
      :class="horizontal ? 'w-48 flex-shrink-0' : 'h-48'"
    >
      <img 
        :src="article.cover_image" 
        :alt="article.title"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      
      <!-- 精选标识 -->
      <div v-if="article.is_featured" class="absolute top-3 left-3">
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          精选
        </span>
      </div>
    </div>
    
    <!-- 内容区域 -->
    <div class="p-6 flex-1 flex flex-col">
      <!-- 分类和日期 -->
      <div class="flex items-center justify-between mb-3 text-sm">
        <span 
          v-if="article.category_name"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
        >
          {{ article.category_name }}
        </span>
        
        <time 
          :datetime="article.created_at"
          class="text-gray-500 dark:text-gray-400"
        >
          {{ formatDate(article.created_at) }}
        </time>
      </div>
      
      <!-- 标题 -->
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
        {{ article.title }}
      </h3>
      
      <!-- 摘要 -->
      <p 
        v-if="article.summary"
        class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-1"
      >
        {{ article.summary }}
      </p>
      
      <!-- 标签 -->
      <div v-if="article.tags && article.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="tag in article.tags.slice(0, 3)"
          :key="tag.id"
          class="tag text-xs"
          :style="{ backgroundColor: tag.color + '20', color: tag.color }"
        >
          {{ tag.name }}
        </span>
        <span v-if="article.tags.length > 3" class="text-xs text-gray-400">
          +{{ article.tags.length - 3 }}
        </span>
      </div>
      
      <!-- 底部信息 -->
      <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-auto">
        <div class="flex items-center space-x-4">
          <!-- 浏览量 -->
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {{ formatNumber(article.view_count || 0) }}
          </span>
          
          <!-- 点赞量 -->
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {{ formatNumber(article.like_count || 0) }}
          </span>
        </div>
        
        <!-- 阅读更多 -->
        <span class="text-primary-600 dark:text-primary-400 font-medium group-hover:underline">
          阅读更多 →
        </span>
      </div>
    </div>
  </article>
</template>

<script>
import { useRouter } from 'vue-router'
import { smartTime } from '@/utils/date'
import { formatNumber } from '@/utils'

export default {
  name: 'ArticleCard',
  props: {
    article: {
      type: Object,
      required: true
    },
    horizontal: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const router = useRouter()
    
    const goToArticle = () => {
      router.push(`/articles/${props.article.id}`)
    }
    
    const formatDate = (date) => {
      return smartTime(date)
    }
    
    return {
      goToArticle,
      formatDate,
      formatNumber
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
