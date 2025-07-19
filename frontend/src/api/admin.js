import request from './request'

/**
 * 管理后台 API 接口
 */

// ==================== 文章管理 ====================

/**
 * 获取管理后台文章列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.status - 文章状态 (published/draft)
 * @param {string} params.keyword - 搜索关键词
 */
export function getAdminArticles(params = {}) {
  return request({
    url: '/admin/articles',
    method: 'GET',
    params
  })
}

/**
 * 获取管理后台文章详情
 * @param {number} id - 文章ID
 */
export function getAdminArticleDetail(id) {
  return request({
    url: `/admin/articles/${id}`,
    method: 'GET'
  })
}

/**
 * 创建文章
 * @param {Object} data - 文章数据
 */
export function createArticle(data) {
  return request({
    url: '/admin/articles',
    method: 'POST',
    data
  })
}

/**
 * 更新文章
 * @param {number} id - 文章ID
 * @param {Object} data - 文章数据
 */
export function updateArticle(id, data) {
  return request({
    url: `/admin/articles/${id}`,
    method: 'PUT',
    data
  })
}

/**
 * 删除文章
 * @param {number} id - 文章ID
 */
export function deleteArticle(id) {
  return request({
    url: `/admin/articles/${id}`,
    method: 'DELETE'
  })
}

// ==================== 分类管理 ====================

/**
 * 获取分类列表（管理后台）
 */
export function getAdminCategories() {
  return request({
    url: '/categories',
    method: 'GET'
  })
}

/**
 * 创建分类
 * @param {Object} data - 分类数据
 */
export function createCategory(data) {
  return request({
    url: '/admin/categories',
    method: 'POST',
    data
  })
}

/**
 * 保存分类（创建或更新的通用方法）
 * @param {Object} data - 分类数据
 * @param {number} id - 分类ID（更新时需要）
 */
export function saveCategory(data, id = null) {
  if (id) {
    return updateCategory(id, data)
  } else {
    return createCategory(data)
  }
}

/**
 * 更新分类
 * @param {number} id - 分类ID
 * @param {Object} data - 分类数据
 */
export function updateCategory(id, data) {
  return request({
    url: `/admin/categories/${id}`,
    method: 'PUT',
    data
  })
}

/**
 * 删除分类
 * @param {number} id - 分类ID
 */
export function deleteCategory(id) {
  return request({
    url: `/admin/categories/${id}`,
    method: 'DELETE'
  })
}

// ==================== 标签管理 ====================

/**
 * 获取标签列表（管理后台）
 */
export function getAdminTags() {
  return request({
    url: '/tags',
    method: 'GET'
  })
}

/**
 * 创建标签
 * @param {Object} data - 标签数据
 */
export function createTag(data) {
  return request({
    url: '/admin/tags',
    method: 'POST',
    data
  })
}

/**
 * 保存标签（创建或更新的通用方法）
 * @param {Object} data - 标签数据
 * @param {number} id - 标签ID（更新时需要）
 */
export function saveTag(data, id = null) {
  if (id) {
    return updateTag(id, data)
  } else {
    return createTag(data)
  }
}

/**
 * 更新标签
 * @param {number} id - 标签ID
 * @param {Object} data - 标签数据
 */
export function updateTag(id, data) {
  return request({
    url: `/admin/tags/${id}`,
    method: 'PUT',
    data
  })
}

/**
 * 删除标签
 * @param {number} id - 标签ID
 */
export function deleteTag(id) {
  return request({
    url: `/admin/tags/${id}`,
    method: 'DELETE'
  })
}

// ==================== 仪表板 ====================

/**
 * 获取仪表板统计数据
 */
export function getDashboardStats() {
  return request({
    url: '/admin/dashboard/stats',
    method: 'GET'
  })
}

// ==================== 用户管理 ====================

/**
 * 获取用户信息
 */
export function getUserProfile() {
  return request({
    url: '/admin/profile',
    method: 'GET'
  })
}

/**
 * 更新用户信息
 * @param {Object} data - 用户数据
 */
export function updateUserProfile(data) {
  return request({
    url: '/admin/profile',
    method: 'PUT',
    data
  })
}

/**
 * 上传头像
 * @param {FormData} formData - 包含文件的表单数据
 */
export function uploadAvatar(formData) {
  return request({
    url: '/admin/upload/avatar',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 修改密码
 * @param {Object} data - 密码数据
 * @param {string} data.oldPassword - 旧密码
 * @param {string} data.newPassword - 新密码
 */
export function changePassword(data) {
  return request({
    url: '/admin/change-password',
    method: 'PUT',
    data
  })
}
