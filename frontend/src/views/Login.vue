<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
          {{ isLoginMode ? '登录账户' : '创建账户' }}
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {{ isLoginMode ? '还没有账户？' : '已有账户？' }}
          <button
            @click="toggleMode"
            class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {{ isLoginMode ? '立即注册' : '立即登录' }}
          </button>
        </p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- 用户名 -->
          <div>
            <label for="identifier" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ isLoginMode ? '用户名或邮箱' : '用户名' }}
            </label>
            <div class="mt-1">
              <input
                id="identifier"
                v-model="form.identifier"
                :type="isLoginMode ? 'text' : 'text'"
                :placeholder="isLoginMode ? '请输入用户名或邮箱' : '请输入用户名'"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
          </div>

          <!-- 邮箱（仅注册时显示） -->
          <div v-if="!isLoginMode">
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              邮箱
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="请输入邮箱"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
          </div>

          <!-- 昵称（仅注册时显示） -->
          <div v-if="!isLoginMode">
            <label for="nickname" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              昵称
            </label>
            <div class="mt-1">
              <input
                id="nickname"
                v-model="form.nickname"
                type="text"
                placeholder="请输入昵称（可选）"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
          </div>

          <!-- 密码 -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              密码
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="form.password"
                type="password"
                placeholder="请输入密码"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
          </div>

          <!-- 确认密码（仅注册时显示） -->
          <div v-if="!isLoginMode">
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              确认密码
            </label>
            <div class="mt-1">
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
          </div>

          <!-- 错误信息 -->
          <div v-if="errorMessage" class="text-red-600 dark:text-red-400 text-sm">
            {{ errorMessage }}
          </div>

          <!-- 提交按钮 -->
          <div>
            <button
              type="submit"
              :disabled="authStore.isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <span v-if="authStore.isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                处理中...
              </span>
              <span v-else>
                {{ isLoginMode ? '登录' : '注册' }}
              </span>
            </button>
          </div>
        </form>

        <!-- 返回首页 -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">或</span>
            </div>
          </div>

          <div class="mt-6">
            <router-link
              to="/"
              class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              返回首页
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isLoginMode = ref(true)
const errorMessage = ref('')

const form = reactive({
  identifier: '',
  email: '',
  nickname: '',
  password: '',
  confirmPassword: ''
})

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  errorMessage.value = ''
  // 清空表单
  Object.keys(form).forEach(key => {
    form[key] = ''
  })
}

const validateForm = () => {
  if (!isLoginMode.value) {
    // 注册验证
    if (!form.identifier || !form.email || !form.password) {
      errorMessage.value = '请填写所有必填字段'
      return false
    }
    
    if (form.password !== form.confirmPassword) {
      errorMessage.value = '两次输入的密码不一致'
      return false
    }
    
    if (form.password.length < 6) {
      errorMessage.value = '密码长度至少6位'
      return false
    }
    
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.identifier)) {
      errorMessage.value = '用户名只能包含字母、数字和下划线，长度3-20位'
      return false
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errorMessage.value = '邮箱格式不正确'
      return false
    }
  } else {
    // 登录验证
    if (!form.identifier || !form.password) {
      errorMessage.value = '请输入用户名/邮箱和密码'
      return false
    }
  }
  
  return true
}

const handleSubmit = async () => {
  errorMessage.value = ''
  
  if (!validateForm()) {
    return
  }
  
  try {
    let result
    
    if (isLoginMode.value) {
      // 登录
      result = await authStore.login({
        identifier: form.identifier,
        password: form.password
      })
    } else {
      // 注册
      result = await authStore.register({
        username: form.identifier,
        email: form.email,
        password: form.password,
        nickname: form.nickname || form.identifier
      })
    }
    
    if (result.success) {
      // 登录/注册成功，跳转到管理后台
      // 由于所有用户现在都是管理员，统一跳转到管理后台
      router.push('/admin')
    } else {
      errorMessage.value = result.message
    }
  } catch (error) {
    errorMessage.value = '操作失败，请稍后重试'
    console.error('Auth error:', error)
  }
}
</script>
