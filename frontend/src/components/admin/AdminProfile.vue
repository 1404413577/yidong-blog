<template>
  <div class="p-6 admin-container">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">个人设置</h2>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 基本信息 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">基本信息</h3>

        <form @submit.prevent="updateProfile" class="space-y-4 admin-form">
          <!-- 头像上传 -->
          <div class="flex flex-col space-y-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              头像
            </label>
            <div class="flex items-center space-x-4">
              <!-- 当前头像显示 -->
              <div class="flex-shrink-0">
                <img
                  v-if="authStore.user?.avatar"
                  :src="getAvatarUrl(authStore.user.avatar)"
                  :alt="authStore.user.nickname"
                  class="h-20 w-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                />
                <div
                  v-else
                  class="h-20 w-20 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600"
                >
                  <span class="text-xl font-medium text-gray-700 dark:text-gray-300">
                    {{ authStore.user?.nickname?.charAt(0) || 'U' }}
                  </span>
                </div>
              </div>

              <!-- Vant上传组件 -->
              <div class="admin-uploader">
                <van-uploader
                  v-model="fileList"
                  :max-count="1"
                  :max-size="5 * 1024 * 1024"
                  accept="image/*"
                  :upload-text="'选择头像'"
                  :preview-size="80"
                  :after-read="handleAvatarUpload"
                  :before-delete="handleBeforeDelete"
                  @oversize="handleOversize"
                  @delete="handleDelete"
                >
                  <template #default>
                    <div class="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full hover:border-blue-500 transition-colors">
                      <van-icon name="photograph" size="24" color="#9ca3af" />
                      <span class="text-xs text-gray-500 mt-1">更换</span>
                    </div>
                  </template>
                </van-uploader>
              </div>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              支持 JPG、PNG、GIF 格式，文件大小不超过 5MB
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              用户名
            </label>
            <input
              :value="authStore.user?.username"
              disabled
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">用户名不可修改</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              昵称
            </label>
            <input
              v-model="profileForm.nickname"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              邮箱
            </label>
            <input
              v-model="profileForm.email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              个人简介
            </label>
            <textarea
              v-model="profileForm.bio"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="介绍一下自己..."
            ></textarea>
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="authStore.isLoading"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {{ authStore.isLoading ? '保存中...' : '保存更改' }}
            </button>
          </div>
        </form>
      </div>

      <!-- 修改密码 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">修改密码</h3>
        
        <form @submit.prevent="changePassword" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              当前密码
            </label>
            <input
              v-model="passwordForm.oldPassword"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              新密码
            </label>
            <input
              v-model="passwordForm.newPassword"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              确认新密码
            </label>
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div v-if="passwordError" class="text-red-600 dark:text-red-400 text-sm">
            {{ passwordError }}
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="authStore.isLoading"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {{ authStore.isLoading ? '修改中...' : '修改密码' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
// 引入Vant组件和方法
import { showToast, showConfirmDialog } from 'vant'
// 引入Vant样式
import '@/styles/vant-admin.css'
// 引入URL工具函数
import { getAvatarUrl } from '@/utils/url'

const authStore = useAuthStore()

// Vant上传组件的文件列表
const fileList = ref([])

const profileForm = reactive({
  nickname: '',
  email: '',
  bio: ''
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordError = ref('')

const initForm = () => {
  if (authStore.user) {
    profileForm.nickname = authStore.user.nickname || ''
    profileForm.email = authStore.user.email || ''
    profileForm.bio = authStore.user.bio || ''
  }
}

// Vant上传组件事件处理
const handleAvatarUpload = async (file) => {
  console.log('Vant上传组件 - 文件选择:', file)

  try {
    // 显示加载提示
    const toast = showToast({
      type: 'loading',
      message: '上传中...',
      forbidClick: true,
      duration: 0
    })

    // 上传文件
    const result = await authStore.uploadAvatar(file.file)
    console.log('上传结果:', result)

    // 关闭加载提示
    toast.close()

    if (result.success) {
      showToast({
        type: 'success',
        message: '头像更新成功！'
      })

      // 清空文件列表，避免重复显示
      fileList.value = []
    } else {
      showToast({
        type: 'fail',
        message: result.message || '头像上传失败'
      })

      // 清空文件列表
      fileList.value = []
    }
  } catch (error) {
    console.error('头像上传失败:', error)
    showToast({
      type: 'fail',
      message: '头像上传失败，请稍后重试'
    })

    // 清空文件列表
    fileList.value = []
  }
}

const handleOversize = () => {
  showToast({
    type: 'fail',
    message: '文件大小不能超过 5MB'
  })
}

const handleBeforeDelete = () => {
  return showConfirmDialog({
    title: '确认删除',
    message: '确定要删除这张图片吗？'
  }).then(() => true).catch(() => false)
}

const handleDelete = () => {
  console.log('删除图片')
}

const updateProfile = async () => {
  try {
    const toast = showToast({
      type: 'loading',
      message: '更新中...',
      forbidClick: true,
      duration: 0
    })

    const result = await authStore.updateProfile(profileForm)
    toast.close()

    if (result.success) {
      showToast({
        type: 'success',
        message: '个人信息更新成功！'
      })
    } else {
      showToast({
        type: 'fail',
        message: result.message || '更新失败'
      })
    }
  } catch (error) {
    console.error('更新个人信息失败:', error)
    showToast({
      type: 'fail',
      message: '更新失败，请稍后重试'
    })
  }
}

const changePassword = async () => {
  passwordError.value = ''

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = '两次输入的新密码不一致'
    return
  }

  if (passwordForm.newPassword.length < 6) {
    passwordError.value = '新密码长度至少6位'
    return
  }

  try {
    const toast = showToast({
      type: 'loading',
      message: '修改中...',
      forbidClick: true,
      duration: 0
    })

    const result = await authStore.changePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    })

    toast.close()

    if (result.success) {
      showToast({
        type: 'success',
        message: '密码修改成功！'
      })

      // 清空表单
      passwordForm.oldPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
    } else {
      passwordError.value = result.message
    }
  } catch (error) {
    console.error('修改密码失败:', error)
    passwordError.value = '修改失败，请稍后重试'
  }
}

onMounted(() => {
  initForm()
})
</script>
