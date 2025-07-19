<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="$emit('close')">
    <div class="relative top-4 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white dark:bg-gray-800" @click.stop>
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
          {{ isEdit ? '编辑文章' : '新建文章' }}
        </h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <form @submit.prevent="saveArticle" class="space-y-4">
        <!-- 标题 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            标题 *
          </label>
          <input
            v-model="form.title"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            placeholder="请输入文章标题"
          />
        </div>

        <!-- 摘要 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            摘要
          </label>
          <textarea
            v-model="form.summary"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            placeholder="请输入文章摘要"
          ></textarea>
        </div>

        <!-- 分类和标签 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              分类
            </label>
            <select
              v-model="form.category_id"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="">请选择分类</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              标签
            </label>
            <div class="flex flex-wrap gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-md min-h-[42px]">
              <span
                v-for="tagId in form.tags"
                :key="tagId"
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {{ getTagName(tagId) }}
                <button
                  type="button"
                  @click="removeTag(tagId)"
                  class="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400"
                >
                  ×
                </button>
              </span>
              <select
                @change="addTag"
                class="text-sm border-none bg-transparent"
              >
                <option value="">添加标签</option>
                <option
                  v-for="tag in availableTags"
                  :key="tag.id"
                  :value="tag.id"
                >
                  {{ tag.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- 内容 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            内容 *
          </label>
          <textarea
            v-model="form.content"
            rows="15"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white font-mono text-sm"
            placeholder="请输入文章内容（支持 Markdown 格式）"
          ></textarea>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            支持 Markdown 语法，如 **粗体**、*斜体*、`代码`、[链接](url) 等
          </p>
        </div>

        <!-- 设置 -->
        <div class="flex items-center space-x-6">
          <label class="flex items-center">
            <input
              v-model="form.is_featured"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">设为精选</span>
          </label>
        </div>

        <!-- 按钮 -->
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            取消
          </button>
          <button
            type="button"
            @click="saveArticle('draft')"
            :disabled="isSubmitting"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
          >
            {{ isSubmitting ? '保存中...' : '保存草稿' }}
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {{ isSubmitting ? '发布中...' : '发布文章' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { getAdminCategories, getAdminTags, createArticle, updateArticle } from '@/api/admin'

const props = defineProps({
  article: Object,
  isEdit: Boolean
})

const emit = defineEmits(['close', 'saved'])

const isSubmitting = ref(false)
const categories = ref([])
const tags = ref([])

const form = reactive({
  title: '',
  summary: '',
  content: '',
  category_id: null,
  tags: [],
  is_featured: false
})

const availableTags = computed(() => {
  return tags.value.filter(tag => !form.tags.includes(tag.id))
})

const getTagName = (tagId) => {
  const tag = tags.value.find(t => t.id === tagId)
  return tag ? tag.name : ''
}

const addTag = (event) => {
  const tagId = parseInt(event.target.value)
  if (tagId && !form.tags.includes(tagId)) {
    form.tags.push(tagId)
  }
  event.target.value = ''
}

const removeTag = (tagId) => {
  const index = form.tags.indexOf(tagId)
  if (index > -1) {
    form.tags.splice(index, 1)
  }
}

const fetchData = async () => {
  try {
    const [categoriesRes, tagsRes] = await Promise.all([
      getAdminCategories(),
      getAdminTags()
    ])

    if (categoriesRes.code === 200) {
      categories.value = categoriesRes.data
    }

    if (tagsRes.code === 200) {
      tags.value = tagsRes.data
    }
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

const initForm = () => {
  if (props.isEdit && props.article) {
    form.title = props.article.title || ''
    form.summary = props.article.summary || ''
    form.content = props.article.content || ''
    form.category_id = props.article.category_id || null
    form.tags = props.article.tags ? props.article.tags.map(tag => tag.id) : []
    form.is_featured = props.article.is_featured || false
  }
}

const saveArticle = async (status = 'published') => {
  try {
    isSubmitting.value = true

    // 确保 status 是有效值
    const validStatus = ['draft', 'published'].includes(status) ? status : 'published'

    // 处理数据，确保空值转换为 null
    const articleData = {
      ...form,
      status: validStatus,
      category_id: form.category_id || null,
      summary: form.summary || null
    }

    console.log('发送的文章数据:', articleData)

    let response
    if (props.isEdit) {
      response = await updateArticle(props.article.id, articleData)
    } else {
      response = await createArticle(articleData)
    }

    if (response.code === 200) {
      emit('saved')
    } else {
      alert(response.message || '保存失败')
    }
  } catch (error) {
    console.error('保存文章失败:', error)
    alert(error.message || '保存失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  await fetchData()
  initForm()
})
</script>
