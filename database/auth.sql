-- 用户认证相关表结构
USE yidong_blog;

-- 用户表
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 用户会话表（用于管理多设备登录）
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户会话表';

-- 密码重置表
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='密码重置表';

-- 修改文章表，添加作者字段
ALTER TABLE articles 
ADD COLUMN author_id INT COMMENT '作者ID' AFTER id,
ADD FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
ADD INDEX idx_author (author_id);

-- 创建默认管理员用户（密码：admin123，需要在应用中修改）
INSERT INTO users (username, email, password_hash, nickname, role, status, email_verified) 
VALUES (
  'admin', 
  'admin@yidong-blog.com', 
  '$2b$10$rQJ8YnWvjQJ8YnWvjQJ8YeKGzQJ8YnWvjQJ8YnWvjQJ8YnWvjQJ8Y.', -- 这是临时密码哈希，需要在应用中生成
  '博主',
  'admin',
  'active',
  TRUE
) ON DUPLICATE KEY UPDATE id=id;

-- 更新现有文章的作者ID（设置为管理员）
UPDATE articles SET author_id = 1 WHERE author_id IS NULL;
