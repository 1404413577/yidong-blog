/**
 * URL工具函数
 */

// 获取API基础URL
export const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
}

/**
 * 获取完整的文件URL
 * @param {string} relativePath - 相对路径，如 '/uploads/avatars/avatar-xxx.jpg'
 * @returns {string} 完整的URL
 */
export const getFileUrl = (relativePath) => {
  if (!relativePath) return null
  
  // 如果已经是完整URL，直接返回
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath
  }
  
  // 如果是相对路径，拼接API基础URL
  const baseUrl = getApiBaseUrl()
  return `${baseUrl}${relativePath}`
}

/**
 * 获取头像URL
 * @param {string} avatarPath - 头像路径
 * @returns {string|null} 完整的头像URL
 */
export const getAvatarUrl = (avatarPath) => {
  return getFileUrl(avatarPath)
}

/**
 * 获取文章图片URL
 * @param {string} imagePath - 图片路径
 * @returns {string|null} 完整的图片URL
 */
export const getArticleImageUrl = (imagePath) => {
  return getFileUrl(imagePath)
}
