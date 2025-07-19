import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '@/stores/app'

// 路由组件懒加载
const Home = () => import('@/views/Home.vue')
const ArticleList = () => import('@/views/ArticleList.vue')
const ArticleDetail = () => import('@/views/ArticleDetail.vue')
const Category = () => import('@/views/Category.vue')
const Tag = () => import('@/views/Tag.vue')
const About = () => import('@/views/About.vue')
const NotFound = () => import('@/views/NotFound.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页',
      transition: 'fade'
    }
  },
  {
    path: '/articles',
    name: 'ArticleList',
    component: ArticleList,
    meta: {
      title: '文章列表',
      transition: 'slide-left'
    }
  },
  {
    path: '/articles/:id(\\d+)',
    name: 'ArticleDetail',
    component: ArticleDetail,
    meta: {
      title: '文章详情',
      transition: 'slide-up'
    }
  },
  {
    path: '/categories/:id(\\d+)',
    name: 'Category',
    component: Category,
    meta: {
      title: '分类',
      transition: 'slide-left'
    }
  },
  {
    path: '/tags/:id(\\d+)',
    name: 'Tag',
    component: Tag,
    meta: {
      title: '标签',
      transition: 'slide-left'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      title: '关于',
      transition: 'fade'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: '页面不存在',
      transition: 'fade'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    } else {
      return { top: 0 }
    }
  }
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const appStore = useAppStore()
  
  // 关闭移动端菜单
  appStore.closeMobileMenu()
  
  // 设置页面标题
  const title = to.meta.title
  if (title) {
    document.title = `${title} - 易东的个人博客`
  } else {
    document.title = '易东的个人博客'
  }
  
  next()
})

// 全局后置钩子
router.afterEach((to, from) => {
  // 页面切换完成后的处理
  console.log(`路由切换: ${from.path} -> ${to.path}`)
})

export default router
