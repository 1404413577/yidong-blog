const { errors } = require('../utils/response');

/**
 * 全局错误处理中间件
 */
async function errorHandler(ctx, next) {
  try {
    await next();
    
    // 处理404
    if (ctx.status === 404 && !ctx.body) {
      ctx.status = 404;
      ctx.body = errors.notFound('接口不存在');
    }
  } catch (error) {
    console.error('服务器错误:', error);
    
    // 设置状态码
    ctx.status = error.status || 500;
    
    // 根据环境返回不同的错误信息
    if (process.env.NODE_ENV === 'production') {
      ctx.body = errors.serverError('服务器内部错误');
    } else {
      ctx.body = errors.serverError(error.message);
    }
    
    // 触发应用级别的错误事件
    ctx.app.emit('error', error, ctx);
  }
}

module.exports = errorHandler;
