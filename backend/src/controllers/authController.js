const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

class AuthController {
  /**
   * 用户注册
   */
  static async register(ctx) {
    try {
      const { username, email, password, nickname } = ctx.request.body;

      // 基本验证
      if (!username || !email || !password) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: '用户名、邮箱和密码不能为空'
        };
        return;
      }

      // 验证用户名格式
      if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: '用户名只能包含字母、数字和下划线，长度3-20位'
        };
        return;
      }

      // 验证邮箱格式
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: '邮箱格式不正确'
        };
        return;
      }

      // 验证密码强度
      if (password.length < 6) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: '密码长度至少6位'
        };
        return;
      }

      const user = await User.create({
        username,
        email,
        password,
        nickname
      });

      // 生成JWT token
      const token = generateToken({ userId: user.id, username: user.username });

      ctx.body = {
        success: true,
        message: '注册成功',
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            nickname: user.nickname,
            avatar: user.avatar,
            role: user.role
          },
          token
        }
      };
    } catch (error) {
      console.error('Register error:', error);
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message || '注册失败'
      };
    }
  }

  /**
   * 用户登录
   */
  static async login(ctx) {
    try {
      const { identifier, password } = ctx.request.body;

      if (!identifier || !password) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: '用户名/邮箱和密码不能为空'
        };
        return;
      }

      const user = await User.validatePassword(identifier, password);
      
      if (!user) {
        ctx.status = 401;
        ctx.body = {
          success: false,
          message: '用户名/邮箱或密码错误'
        };
        return;
      }

      if (user.status !== 'active') {
        ctx.status = 401;
        ctx.body = {
          success: false,
          message: '账户已被禁用，请联系管理员'
        };
        return;
      }

      // 生成JWT token
      const token = generateToken({ userId: user.id, username: user.username });

      ctx.body = {
        success: true,
        message: '登录成功',
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            nickname: user.nickname,
            avatar: user.avatar,
            role: user.role
          },
          token
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: '登录失败'
      };
    }
  }

  /**
   * 获取当前用户信息
   */
  static async getCurrentUser(ctx) {
    try {
      const user = ctx.user;
      
      // 获取用户统计信息
      const stats = await User.getStats(user.id);

      ctx.body = {
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            nickname: user.nickname,
            avatar: user.avatar,
            bio: user.bio,
            role: user.role,
            stats
          }
        }
      };
    } catch (error) {
      console.error('Get current user error:', error);
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: '获取用户信息失败'
      };
    }
  }

  /**
   * 更新用户信息
   */
  static async updateProfile(ctx) {
    try {
      const { nickname, bio, email } = ctx.request.body;
      const userId = ctx.user.id;

      const updateData = {};
      if (nickname !== undefined) updateData.nickname = nickname;
      if (bio !== undefined) updateData.bio = bio;
      if (email !== undefined) {
        // 验证邮箱格式
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          ctx.status = 400;
          ctx.body = {
            success: false,
            message: '邮箱格式不正确'
          };
          return;
        }
        updateData.email = email;
      }

      const updatedUser = await User.update(userId, updateData);

      ctx.body = {
        success: true,
        message: '更新成功',
        data: {
          user: updatedUser
        }
      };
    } catch (error) {
      console.error('Update profile error:', error);
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message || '更新失败'
      };
    }
  }

  /**
   * 修改密码
   */
  static async changePassword(ctx) {
    try {
      const { oldPassword, newPassword } = ctx.request.body;
      const userId = ctx.user.id;

      if (!oldPassword || !newPassword) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: '旧密码和新密码不能为空'
        };
        return;
      }

      if (newPassword.length < 6) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: '新密码长度至少6位'
        };
        return;
      }

      await User.changePassword(userId, oldPassword, newPassword);

      ctx.body = {
        success: true,
        message: '密码修改成功'
      };
    } catch (error) {
      console.error('Change password error:', error);
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message || '密码修改失败'
      };
    }
  }

  /**
   * 用户登出（客户端处理，服务端可以记录日志）
   */
  static async logout(ctx) {
    try {
      // 这里可以添加登出日志记录
      console.log(`User ${ctx.user.username} logged out`);

      ctx.body = {
        success: true,
        message: '登出成功'
      };
    } catch (error) {
      console.error('Logout error:', error);
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: '登出失败'
      };
    }
  }
}

module.exports = AuthController;
