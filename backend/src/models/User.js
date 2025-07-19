const { query } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  /**
   * 根据用户名或邮箱查找用户
   * @param {string} identifier - 用户名或邮箱
   */
  static async findByIdentifier(identifier) {
    try {
      const sql = `
        SELECT id, username, email, password_hash, nickname, avatar, bio, role, status, email_verified, last_login_at, created_at, updated_at
        FROM users 
        WHERE (username = ? OR email = ?) AND status != 'banned'
      `;
      const users = await query(sql, [identifier, identifier]);
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('User.findByIdentifier error:', error);
      throw error;
    }
  }

  /**
   * 根据ID查找用户
   * @param {number} id - 用户ID
   */
  static async findById(id) {
    try {
      const sql = `
        SELECT id, username, email, nickname, avatar, bio, role, status, email_verified, last_login_at, created_at, updated_at
        FROM users 
        WHERE id = ?
      `;
      const users = await query(sql, [id]);
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('User.findById error:', error);
      throw error;
    }
  }

  /**
   * 创建新用户
   * @param {Object} userData - 用户数据
   */
  static async create(userData) {
    try {
      const { username, email, password, nickname } = userData;
      
      // 检查用户名和邮箱是否已存在
      const existingUser = await this.findByIdentifier(username);
      if (existingUser) {
        throw new Error('用户名已存在');
      }

      const existingEmail = await this.findByIdentifier(email);
      if (existingEmail && existingEmail.username !== username) {
        throw new Error('邮箱已存在');
      }

      // 加密密码
      const passwordHash = await bcrypt.hash(password, 10);

      const sql = `
        INSERT INTO users (username, email, password_hash, nickname, role, status, email_verified)
        VALUES (?, ?, ?, ?, 'admin', 'active', FALSE)
      `;
      
      const result = await query(sql, [username, email, passwordHash, nickname || username]);
      
      // 返回新创建的用户信息（不包含密码）
      return await this.findById(result.insertId);
    } catch (error) {
      console.error('User.create error:', error);
      throw error;
    }
  }

  /**
   * 验证用户密码
   * @param {string} identifier - 用户名或邮箱
   * @param {string} password - 密码
   */
  static async validatePassword(identifier, password) {
    try {
      const user = await this.findByIdentifier(identifier);
      if (!user) {
        return null;
      }

      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        return null;
      }

      // 更新最后登录时间
      await query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id]);

      // 返回用户信息（不包含密码哈希）
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('User.validatePassword error:', error);
      throw error;
    }
  }

  /**
   * 更新用户信息
   * @param {number} id - 用户ID
   * @param {Object} updateData - 更新数据
   */
  static async update(id, updateData) {
    try {
      const allowedFields = ['nickname', 'avatar', 'bio', 'email'];
      const updates = [];
      const values = [];

      for (const [key, value] of Object.entries(updateData)) {
        if (allowedFields.includes(key) && value !== undefined) {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      }

      if (updates.length === 0) {
        throw new Error('没有有效的更新字段');
      }

      values.push(id);
      const sql = `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`;
      
      await query(sql, values);
      return await this.findById(id);
    } catch (error) {
      console.error('User.update error:', error);
      throw error;
    }
  }

  /**
   * 修改密码
   * @param {number} id - 用户ID
   * @param {string} oldPassword - 旧密码
   * @param {string} newPassword - 新密码
   */
  static async changePassword(id, oldPassword, newPassword) {
    try {
      // 获取用户当前密码哈希
      const sql = 'SELECT password_hash FROM users WHERE id = ?';
      const users = await query(sql, [id]);
      
      if (users.length === 0) {
        throw new Error('用户不存在');
      }

      // 验证旧密码
      const isValid = await bcrypt.compare(oldPassword, users[0].password_hash);
      if (!isValid) {
        throw new Error('旧密码不正确');
      }

      // 加密新密码
      const newPasswordHash = await bcrypt.hash(newPassword, 10);

      // 更新密码
      await query('UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?', [newPasswordHash, id]);
      
      return true;
    } catch (error) {
      console.error('User.changePassword error:', error);
      throw error;
    }
  }

  /**
   * 获取用户统计信息
   * @param {number} userId - 用户ID
   */
  static async getStats(userId) {
    try {
      const [articleStats] = await query(`
        SELECT 
          COUNT(*) as total_articles,
          SUM(view_count) as total_views,
          SUM(like_count) as total_likes
        FROM articles 
        WHERE author_id = ? AND status = 'published'
      `, [userId]);

      return {
        articles: articleStats.total_articles || 0,
        views: articleStats.total_views || 0,
        likes: articleStats.total_likes || 0
      };
    } catch (error) {
      console.error('User.getStats error:', error);
      throw error;
    }
  }
}

module.exports = User;
