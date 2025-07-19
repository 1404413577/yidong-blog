<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">个人设置</h2>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 基本信息 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">基本信息</h3>
        
        <form @submit.prevent="updateProfile" class="space-y-4">
          <!-- 头像 -->
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <img
                v-if="authStore.user?.avatar"
                :src="authStore.user.avatar"
                :alt="authStore.user.nickname"
                class="h-16 w-16 rounded-full object-cover"
              />
              <div
                v-else
                class="h-16 w-16 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center"
              >
                <span class="text-xl font-medium text-gray-700 dark:text-gray-300">
                  {{ authStore.user?.nickname?.charAt(0) || 'U' }}
                </span>
              </div>
            </div>
            <div>
              <input
                ref="avatarInput"
                type="file"
                accept="image/*"
                @change="handleAvatarChange"
                class="hidden"
              />
              <button
                type="button"
                @click="$refs.avatarInput.click()"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              >
                更换头像
              </button>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                支持 JPG、PNG 格式，文件大小不超过 5MB
              </p>
            </div>
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

const authStore = useAuthStore()

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

const updateProfile = async () => {
  try {
    const result = await authStore.updateProfile(profileForm)
    if (result.success) {
      alert('个人信息更新成功！')
    } else {
      alert(result.message)
    }
  } catch (error) {
    console.error('更新个人信息失败:', error)
    alert('更新失败，请稍后重试')
  }
}

const handleAvatarChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
    return
  }

  // 验证文件大小（5MB）
  if (file.size > 5 * 1024 * 1024) {
    alert('文件大小不能超过 5MB')
    return
  }

  try {
    const result = await authStore.uploadAvatar(file)
    if (result.success) {
      alert('头像更新成功！')
    } else {
      alert(result.message)
    }
  } catch (error) {
    console.error('头像上传失败:', error)
    alert('头像上传失败，请稍后重试')
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
    const result = await authStore.changePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    })

    if (result.success) {
      alert('密码修改成功！')
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
