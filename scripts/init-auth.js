const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function initAuth() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '0519',
    database: 'yidong_blog',
    multipleStatements: true
  });

  try {
    console.log('开始初始化用户认证数据库...');

    // 创建用户表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
        email VARCHAR(100) NOT NULL UNIQUE COMMENT '邮箱',
        password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希',
        nickname VARCHAR(50) COMMENT '昵称',
        avatar VARCHAR(255) COMMENT '头像URL',
        bio TEXT COMMENT '个人简介',
        role ENUM('admin', 'user') DEFAULT 'user' COMMENT '用户角色',
        status ENUM('active', 'inactive', 'banned') DEFAULT 'active' COMMENT '用户状态',
        email_verified BOOLEAN DEFAULT FALSE COMMENT '邮箱是否验证',
        last_login_at TIMESTAMP NULL COMMENT '最后登录时间',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        INDEX idx_username (username),
        INDEX idx_email (email),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表'
    `);
    console.log('✅ 用户表创建成功');

    // 创建用户会话表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL COMMENT '用户ID',
        token_hash VARCHAR(255) NOT NULL COMMENT 'JWT token哈希',
        device_info VARCHAR(255) COMMENT '设备信息',
        ip_address VARCHAR(45) COMMENT 'IP地址',
        user_agent TEXT COMMENT '用户代理',
        expires_at TIMESTAMP NOT NULL COMMENT '过期时间',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_token_hash (token_hash),
        INDEX idx_expires_at (expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户会话表'
    `);
    console.log('✅ 用户会话表创建成功');

    // 创建密码重置表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL COMMENT '用户ID',
        token VARCHAR(255) NOT NULL COMMENT '重置令牌',
        expires_at TIMESTAMP NOT NULL COMMENT '过期时间',
        used BOOLEAN DEFAULT FALSE COMMENT '是否已使用',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_token (token),
        INDEX idx_expires_at (expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='密码重置表'
    `);
    console.log('✅ 密码重置表创建成功');

    // 检查articles表是否已有author_id字段
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'yidong_blog' AND TABLE_NAME = 'articles' AND COLUMN_NAME = 'author_id'
    `);

    if (columns.length === 0) {
      // 修改文章表，添加作者字段
      await connection.execute(`
        ALTER TABLE articles 
        ADD COLUMN author_id INT COMMENT '作者ID' AFTER id,
        ADD FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
        ADD INDEX idx_author (author_id)
      `);
      console.log('✅ 文章表添加作者字段成功');
    } else {
      console.log('✅ 文章表作者字段已存在');
    }

    // 生成管理员密码哈希
    const adminPassword = 'admin123';
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    // 创建默认管理员用户
    await connection.execute(`
      INSERT INTO users (username, email, password_hash, nickname, role, status, email_verified) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        password_hash = VALUES(password_hash),
        nickname = VALUES(nickname),
        role = VALUES(role),
        status = VALUES(status),
        email_verified = VALUES(email_verified)
    `, ['admin', 'admin@yidong-blog.com', passwordHash, '博主', 'admin', 'active', true]);
    console.log('✅ 默认管理员用户创建成功');
    console.log('   用户名: admin');
    console.log('   密码: admin123');
    console.log('   邮箱: admin@yidong-blog.com');

    // 更新现有文章的作者ID
    await connection.execute(`
      UPDATE articles SET author_id = 1 WHERE author_id IS NULL
    `);
    console.log('✅ 现有文章作者ID更新成功');

    console.log('\n🎉 用户认证数据库初始化完成！');

  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
  } finally {
    await connection.end();
  }
}

initAuth();
