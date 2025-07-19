const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// JWT密钥（在生产环境中应该使用环境变量）
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * 生成JWT token
 * @param {Object} payload - 载荷数据
 * @returns {string} JWT token
 */
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * 验证JWT token
 * @param {string} token - JWT token
 * @returns {Object} 解码后的载荷
 */
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

/**
 * 认证中间件 - 验证用户是否已登录
 */
async function authenticate(ctx, next) {
  try {
    const authHeader = ctx.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: '未提供认证令牌'
      };
      return;
    }

    const token = authHeader.substring(7); // 移除 'Bearer ' 前缀
    
    try {
      const decoded = verifyToken(token);
      
      // 查询用户信息
      const users = await query(
        'SELECT id, username, email, nickname, avatar, role, status FROM users WHERE id = ? AND status = ?',
        [decoded.userId, 'active']
      );

      if (users.length === 0) {
        ctx.status = 401;
        ctx.body = {
          success: false,
          message: '用户不存在或已被禁用'
        };
        return;
      }

      // 将用户信息添加到上下文中
      ctx.user = users[0];
      await next();
      
    } catch (jwtError) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: '无效的认证令牌'
      };
      return;
    }
    
  } catch (error) {
    console.error('Authentication error:', error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: '认证过程中发生错误'
    };
  }
}

/**
 * 权限检查中间件 - 检查用户是否有特定权限
 * @param {string|Array} roles - 允许的角色
 */
function authorize(roles = []) {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return async (ctx, next) => {
    if (!ctx.user) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: '请先登录'
      };
      return;
    }

    if (roles.length > 0 && !roles.includes(ctx.user.role)) {
      ctx.status = 403;
      ctx.body = {
        success: false,
        message: '权限不足'
      };
      return;
    }

    await next();
  };
}

/**
 * 可选认证中间件 - 如果有token则验证，没有则跳过
 */
async function optionalAuth(ctx, next) {
  const authHeader = ctx.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    
    try {
      const decoded = verifyToken(token);
      
      const users = await query(
        'SELECT id, username, email, nickname, avatar, role, status FROM users WHERE id = ? AND status = ?',
        [decoded.userId, 'active']
      );

      if (users.length > 0) {
        ctx.user = users[0];
      }
    } catch (error) {
      // 忽略token验证错误，继续执行
      console.log('Optional auth failed:', error.message);
    }
  }
  
  await next();
}

module.exports = {
  generateToken,
  verifyToken,
  authenticate,
  authorize,
  optionalAuth,
  JWT_SECRET
};
