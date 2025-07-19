<template>
  <div class="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- 个人介绍 -->
      <section class="text-center mb-16">
        <div class="mb-8 animate-bounce-in">
          <div class="w-32 h-32 mx-auto bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
            <span class="text-white text-4xl font-bold">易</span>
          </div>
        </div>
        
        <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 animate-slide-up">
          <span class="text-gradient">易东</span>
        </h1>
        
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto animate-slide-up" style="animation-delay: 0.1s">
          一名热爱技术的前端开发者，专注于现代Web技术栈，喜欢分享技术心得和编程经验。
        </p>
        
        <div class="flex justify-center space-x-6 animate-slide-up" style="animation-delay: 0.2s">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="social-link">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <a href="mailto:contact@example.com" class="social-link">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="social-link">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </a>
        </div>
      </section>
      
      <!-- 技能栈 -->
      <section class="mb-16">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">技能栈</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(skill, index) in skills" :key="skill.name" class="card p-6 text-center animate-slide-up" :style="{ 'animation-delay': `${0.1 * index}s` }">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" :style="{ backgroundColor: skill.color + '20' }">
              <div class="text-2xl" :style="{ color: skill.color }">{{ skill.icon }}</div>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ skill.name }}</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">{{ skill.description }}</p>
          </div>
        </div>
      </section>
      
      <!-- 博客统计 -->
      <section class="mb-16">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">博客统计</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="(stat, index) in stats" :key="stat.label" class="text-center animate-slide-up" :style="{ 'animation-delay': `${0.1 * index}s` }">
            <div class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">{{ stat.value }}</div>
            <div class="text-gray-600 dark:text-gray-400">{{ stat.label }}</div>
          </div>
        </div>
      </section>
      
      <!-- 关于博客 -->
      <section class="card p-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">关于这个博客</h2>
        <div class="prose prose-lg max-w-none text-gray-600 dark:text-gray-300">
          <p class="mb-4">
            这个博客是我分享技术心得和记录成长历程的地方。在这里，你可以找到关于前端开发、后端技术、编程思考等方面的内容。
          </p>
          <p class="mb-4">
            我相信技术分享能够帮助更多的人成长，也希望通过这个平台与大家交流学习，共同进步。
          </p>
          <p class="mb-6">
            如果你对某个话题感兴趣，或者有任何建议和想法，欢迎通过邮件或社交媒体与我联系。
          </p>
          
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">技术栈</h3>
          <ul class="mb-6">
            <li><strong>前端：</strong>Vue 3 + Vite + JavaScript + Tailwind CSS</li>
            <li><strong>后端：</strong>Koa.js + MySQL</li>
            <li><strong>部署：</strong>前后端分离架构</li>
            <li><strong>特色：</strong>移动端优先设计，支持暗黑模式</li>
          </ul>
          
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">联系方式</h3>
          <ul>
            <li><strong>邮箱：</strong>contact@example.com</li>
            <li><strong>GitHub：</strong><a href="https://github.com" target="_blank" rel="noopener noreferrer" class="text-primary-600 dark:text-primary-400 hover:underline">@yidong</a></li>
            <li><strong>Twitter：</strong><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="text-primary-600 dark:text-primary-400 hover:underline">@yidong</a></li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useBlogStore } from '@/stores/blog'

export default {
  name: 'About',
  setup() {
    const blogStore = useBlogStore()
    
    const skills = ref([
      {
        name: 'Vue.js',
        icon: '🚀',
        color: '#4FC08D',
        description: '现代化的前端框架'
      },
      {
        name: 'JavaScript',
        icon: '⚡',
        color: '#F7DF1E',
        description: '动态编程语言'
      },
      {
        name: 'Node.js',
        icon: '🟢',
        color: '#339933',
        description: '服务端JavaScript运行时'
      },
      {
        name: 'MySQL',
        icon: '🗄️',
        color: '#4479A1',
        description: '关系型数据库'
      },
      {
        name: 'Tailwind CSS',
        icon: '🎨',
        color: '#06B6D4',
        description: '实用优先的CSS框架'
      },
      {
        name: 'Git',
        icon: '📝',
        color: '#F05032',
        description: '版本控制系统'
      }
    ])
    
    const stats = computed(() => [
      {
        label: '文章数量',
        value: blogStore.articles.length || 0
      },
      {
        label: '分类数量',
        value: blogStore.categories.length || 0
      },
      {
        label: '标签数量',
        value: blogStore.tags.length || 0
      },
      {
        label: '总浏览量',
        value: '10K+'
      }
    ])
    
    onMounted(async () => {
      try {
        await Promise.all([
          blogStore.fetchArticles({ pageSize: 100 }),
          blogStore.fetchCategories(),
          blogStore.fetchTags()
        ])
      } catch (error) {
        console.error('加载统计数据失败:', error)
      }
    })
    
    return {
      skills,
      stats
    }
  }
}
</script>

<style scoped>
.social-link {
  @apply w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 hover:scale-110;
}
</style>
