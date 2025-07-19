<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">分类管理</h2>
      <button
        @click="showCreateModal = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
      >
        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        新建分类
      </button>
    </div>

    <!-- 分类列表 -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="category in categories"
        :key="category.id"
        class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
      >
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ category.name }}
          </h3>
          <div class="flex items-center space-x-2">
            <button
              @click="editCategory(category)"
              class="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm"
            >
              编辑
            </button>
            <button
              @click="deleteCategory(category)"
              class="text-red-600 hover:text-red-800 dark:text-red-400 text-sm"
            >
              删除
            </button>
          </div>
        </div>
        <p v-if="category.description" class="text-gray-600 dark:text-gray-300 text-sm mb-2">
          {{ category.description }}
        </p>
        <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>{{ category.article_count || 0 }} 篇文章</span>
          <div
            v-if="category.color"
            class="w-4 h-4 rounded-full"
            :style="{ backgroundColor: category.color }"
          ></div>
        </div>
      </div>
    </div>

    <!-- 创建/编辑分类模态框 -->
    <div
      v-if="showCreateModal || showEditModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeModal"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800"
        @click.stop
      >
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
          {{ showEditModal ? '编辑分类' : '新建分类' }}
        </h3>
        
        <form @submit.prevent="saveCategory" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              分类名称
            </label>
            <input
              v-model="categoryForm.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              描述
            </label>
            <textarea
              v-model="categoryForm.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              颜色
            </label>
            <input
              v-model="categoryForm.color"
              type="color"
              class="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md"
            />
          </div>
          
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ isSubmitting ? '保存中...' : '保存' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

const isLoading = ref(false)
const isSubmitting = ref(false)
const categories = ref([])
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingCategory = ref(null)

const categoryForm = reactive({
  name: '',
  description: '',
  color: '#3B82F6'
})

const fetchCategories = async () => {
  try {
    isLoading.value = true
    const response = await axios.get('/api/categories')
    if (response.data.success) {
      categories.value = response.data.data
    }
  } catch (error) {
    console.error('获取分类列表失败:', error)
  } finally {
    isLoading.value = false
  }
}

const editCategory = (category) => {
  editingCategory.value = category
  categoryForm.name = category.name
  categoryForm.description = category.description || ''
  categoryForm.color = category.color || '#3B82F6'
  showEditModal.value = true
}

const deleteCategory = async (category) => {
  if (!confirm(`确定要删除分类"${category.name}"吗？`)) {
    return
  }
  
  try {
    const response = await axios.delete(`/api/admin/categories/${category.id}`)
    if (response.data.success) {
      fetchCategories()
    }
  } catch (error) {
    console.error('删除分类失败:', error)
    alert(error.response?.data?.message || '删除失败，请稍后重试')
  }
}

const saveCategory = async () => {
  try {
    isSubmitting.value = true
    
    if (showEditModal.value) {
      const response = await axios.put(`/api/admin/categories/${editingCategory.value.id}`, categoryForm)
      if (response.data.success) {
        fetchCategories()
        closeModal()
      }
    } else {
      const response = await axios.post('/api/admin/categories', categoryForm)
      if (response.data.success) {
        fetchCategories()
        closeModal()
      }
    }
  } catch (error) {
    console.error('保存分类失败:', error)
    alert(error.response?.data?.message || '保存失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingCategory.value = null
  categoryForm.name = ''
  categoryForm.description = ''
  categoryForm.color = '#3B82F6'
}

onMounted(() => {
  fetchCategories()
})
</script>
