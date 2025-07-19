import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const isLoading = ref(false)

  // 计算属性
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  // 设置axios默认headers
  const setAuthHeader = (authToken) => {
    if (authToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
      localStorage.setItem('token', authToken)
    } else {
      delete axios.defaults.headers.common['Authorization']
      localStorage.removeItem('token')
    }
  }

  // 初始化认证状态
  const initAuth = async () => {
    if (token.value) {
      setAuthHeader(token.value)
      try {
        await getCurrentUser()
      } catch (error) {
        console.error('初始化认证失败:', error)
        logout()
      }
    }
  }

  // 用户登录
  const login = async (credentials) => {
    try {
      isLoading.value = true
      const response = await axios.post('/api/auth/login', credentials)
      
      if (response.data.success) {
        const { user: userData, token: authToken } = response.data.data
        user.value = userData
        token.value = authToken
        setAuthHeader(authToken)
        
        return { success: true, user: userData }
      } else {
        throw new Error(response.data.message || '登录失败')
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || '登录失败'
      return { success: false, message }
    } finally {
      isLoading.value = false
    }
  }

  // 用户注册
  const register = async (userData) => {
    try {
      isLoading.value = true
      const response = await axios.post('/api/auth/register', userData)
      
      if (response.data.success) {
        const { user: newUser, token: authToken } = response.data.data
        user.value = newUser
        token.value = authToken
        setAuthHeader(authToken)
        
        return { success: true, user: newUser }
      } else {
        throw new Error(response.data.message || '注册失败')
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || '注册失败'
      return { success: false, message }
    } finally {
      isLoading.value = false
    }
  }

  // 获取当前用户信息
  const getCurrentUser = async () => {
    try {
      const response = await axios.get('/api/auth/me')
      if (response.data.success) {
        user.value = response.data.data.user
        return user.value
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  }

  // 更新用户信息
  const updateProfile = async (profileData) => {
    try {
      isLoading.value = true
      const response = await axios.put('/api/auth/profile', profileData)
      
      if (response.data.success) {
        user.value = { ...user.value, ...response.data.data.user }
        return { success: true, user: user.value }
      } else {
        throw new Error(response.data.message || '更新失败')
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || '更新失败'
      return { success: false, message }
    } finally {
      isLoading.value = false
    }
  }

  // 修改密码
  const changePassword = async (passwordData) => {
    try {
      isLoading.value = true
      const response = await axios.put('/api/auth/password', passwordData)
      
      if (response.data.success) {
        return { success: true, message: '密码修改成功' }
      } else {
        throw new Error(response.data.message || '密码修改失败')
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || '密码修改失败'
      return { success: false, message }
    } finally {
      isLoading.value = false
    }
  }

  // 上传头像
  const uploadAvatar = async (file) => {
    try {
      isLoading.value = true
      const formData = new FormData()
      formData.append('avatar', file)
      
      const response = await axios.post('/api/auth/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      if (response.data.success) {
        user.value.avatar = response.data.data.avatar
        return { success: true, avatar: response.data.data.avatar }
      } else {
        throw new Error(response.data.message || '头像上传失败')
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || '头像上传失败'
      return { success: false, message }
    } finally {
      isLoading.value = false
    }
  }

  // 用户登出
  const logout = async () => {
    try {
      if (token.value) {
        await axios.post('/api/auth/logout')
      }
    } catch (error) {
      console.error('登出请求失败:', error)
    } finally {
      user.value = null
      token.value = null
      setAuthHeader(null)
    }
  }

  // 验证token有效性
  const verifyToken = async () => {
    try {
      const response = await axios.get('/api/auth/verify')
      return response.data.success
    } catch (error) {
      return false
    }
  }

  return {
    // 状态
    user,
    token,
    isLoading,
    
    // 计算属性
    isAuthenticated,
    isAdmin,
    
    // 方法
    initAuth,
    login,
    register,
    getCurrentUser,
    updateProfile,
    changePassword,
    uploadAvatar,
    logout,
    verifyToken
  }
})
