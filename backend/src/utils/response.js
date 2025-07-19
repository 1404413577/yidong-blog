/**
 * 统一响应格式工具
 */

// 成功响应
function success(data = null, message = 'success', code = 200) {
  return {
    code,
    message,
    data,
    timestamp: new Date().toISOString()
  };
}

// 错误响应
function error(message = 'error', code = 500, data = null) {
  return {
    code,
    message,
    data,
    timestamp: new Date().toISOString()
  };
}

// 分页响应
function paginate(data, total, page, pageSize) {
  return success({
    list: data,
    pagination: {
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil(total / pageSize)
    }
  });
}

// 常用错误响应
const errors = {
  notFound: (message = '资源不存在') => error(message, 404),
  badRequest: (message = '请求参数错误') => error(message, 400),
  unauthorized: (message = '未授权访问') => error(message, 401),
  forbidden: (message = '禁止访问') => error(message, 403),
  serverError: (message = '服务器内部错误') => error(message, 500)
};

module.exports = {
  success,
  error,
  paginate,
  errors
};
