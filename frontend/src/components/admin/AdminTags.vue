<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">标签管理</h2>
      <button
        @click="showCreateModal = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
      >
        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        新建标签
      </button>
    </div>

    <!-- 标签列表 -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else class="flex flex-wrap gap-3">
      <div
        v-for="tag in tags"
        :key="tag.id"
        class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 flex items-center space-x-3"
      >
        <div
          class="w-4 h-4 rounded-full"
          :style="{ backgroundColor: tag.color || '#3B82F6' }"
        ></div>
        <span class="text-gray-900 dark:text-white font-medium">{{ tag.name }}</span>
        <span class="text-sm text-gray-500 dark:text-gray-400">({{ tag.article_count || 0 }})</span>
        <div class="flex items-center space-x-2">
          <button
            @click="editTag(tag)"
            class="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm"
          >
            编辑
          </button>
          <button
            @click="deleteTagHandler(tag)"
            class="text-red-600 hover:text-red-800 dark:text-red-400 text-sm"
          >
            删除
          </button>
        </div>
      </div>
    </div>

    <!-- 创建/编辑标签模态框 -->
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
          {{ showEditModal ? '编辑标签' : '新建标签' }}
        </h3>
        
        <form @submit.prevent="saveTag" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              标签名称
            </label>
            <input
              v-model="tagForm.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              颜色
            </label>
            <input
              v-model="tagForm.color"
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
import { getAdminTags, createTag, updateTag, deleteTag } from '@/api/admin'

const isLoading = ref(false)
const isSubmitting = ref(false)
const tags = ref([])
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingTag = ref(null)

const tagForm = reactive({
  name: '',
  color: '#3B82F6'
})

const fetchTags = async () => {
  try {
    isLoading.value = true
    const response = await getAdminTags()
    if (response.code === 200) {
      tags.value = response.data
    }
  } catch (error) {
    console.error('获取标签列表失败:', error)
  } finally {
    isLoading.value = false
  }
}

const editTag = (tag) => {
  editingTag.value = tag
  tagForm.name = tag.name
  tagForm.color = tag.color || '#3B82F6'
  showEditModal.value = true
}

const deleteTagHandler = async (tag) => {
  if (!confirm(`确定要删除标签"${tag.name}"吗？`)) {
    return
  }

  try {
    const response = await deleteTag(tag.id)
    if (response.code === 200) {
      fetchTags()
    }
  } catch (error) {
    console.error('删除标签失败:', error)
    alert(error.message || '删除失败，请稍后重试')
  }
}

const saveTag = async () => {
  try {
    isSubmitting.value = true

    let response
    if (showEditModal.value) {
      response = await updateTag(editingTag.value.id, tagForm)
    } else {
      response = await createTag(tagForm)
    }

    if (response.code === 200) {
      fetchTags()
      closeModal()
    }
  } catch (error) {
    console.error('保存标签失败:', error)
    alert(error.message || '保存失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingTag.value = null
  tagForm.name = ''
  tagForm.color = '#3B82F6'
}

onMounted(() => {
  fetchTags()
})
</script>
