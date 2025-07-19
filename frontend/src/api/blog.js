import request from './request'

/**
 * 获取文章列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {number} params.categoryId - 分类ID
 * @param {boolean} params.featured - 是否精选
 */
export function getArticles(params = {}) {
  return request({
    url: '/articles',
    method: 'GET',
    params
  })
}

/**
 * 获取文章详情
 * @param {number} id - 文章ID
 */
export function getArticleDetail(id) {
  return request({
    url: `/articles/${id}`,
    method: 'GET'
  })
}

/**
 * 增加文章浏览量
 * @param {number} id - 文章ID
 */
export function incrementArticleView(id) {
  return request({
    url: `/articles/${id}/view`,
    method: 'PUT'
  })
}

/**
 * 获取精选文章
 * @param {number} limit - 限制数量
 */
export function getFeaturedArticles(limit = 5) {
  return request({
    url: '/articles/featured',
    method: 'GET',
    params: { limit }
  })
}

/**
 * 获取分类列表
 */
export function getCategories() {
  return request({
    url: '/categories',
    method: 'GET'
  })
}

/**
 * 获取分类详情
 * @param {number} id - 分类ID
 */
export function getCategoryDetail(id) {
  return request({
    url: `/categories/${id}`,
    method: 'GET'
  })
}

/**
 * 获取分类下的文章
 * @param {number} id - 分类ID
 * @param {Object} params - 查询参数
 */
export function getCategoryArticles(id, params = {}) {
  return request({
    url: `/categories/${id}/articles`,
    method: 'GET',
    params
  })
}

/**
 * 获取标签列表
 */
export function getTags() {
  return request({
    url: '/tags',
    method: 'GET'
  })
}

/**
 * 获取热门标签
 * @param {number} limit - 限制数量
 */
export function getPopularTags(limit = 10) {
  return request({
    url: '/tags/popular',
    method: 'GET',
    params: { limit }
  })
}

/**
 * 获取标签详情
 * @param {number} id - 标签ID
 */
export function getTagDetail(id) {
  return request({
    url: `/tags/${id}`,
    method: 'GET'
  })
}

/**
 * 获取标签下的文章
 * @param {number} id - 标签ID
 * @param {Object} params - 查询参数
 */
export function getTagArticles(id, params = {}) {
  return request({
    url: `/tags/${id}/articles`,
    method: 'GET',
    params
  })
}
