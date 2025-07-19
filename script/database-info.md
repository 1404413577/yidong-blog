# 易东博客系统数据库表结构说明

生成时间: 2025/7/20 01:21:40

## 数据库概览

本项目包含 7 个数据表：

### article_tags 

| 字段名 | 类型 | 是否为空 | 键 | 默认值 | 说明 |
|--------|------|----------|-----|--------|------|
| article_id | int | NO | PRI |  |  |
| tag_id | int | NO | PRI |  |  |

### articles 

| 字段名 | 类型 | 是否为空 | 键 | 默认值 | 说明 |
|--------|------|----------|-----|--------|------|
| id | int | NO | PRI |  | auto_increment |
| author_id | int | YES | MUL |  |  |
| title | varchar(200) | NO |  |  |  |
| content | longtext | NO |  |  |  |
| summary | text | YES |  |  |  |
| cover_image | varchar(255) | YES |  |  |  |
| category_id | int | YES | MUL |  |  |
| status | enum('draft','published') | YES |  | published |  |
| is_featured | tinyint(1) | YES |  | 0 |  |
| view_count | int | YES |  | 0 |  |
| like_count | int | YES |  | 0 |  |
| created_at | timestamp | YES |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| updated_at | timestamp | YES |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |

### categories 

| 字段名 | 类型 | 是否为空 | 键 | 默认值 | 说明 |
|--------|------|----------|-----|--------|------|
| id | int | NO | PRI |  | auto_increment |
| name | varchar(50) | NO | UNI |  |  |
| description | text | YES |  |  |  |
| sort_order | int | YES |  | 0 |  |
| created_at | timestamp | YES |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| updated_at | timestamp | YES |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |

### password_resets - 密码重置表

| 字段名 | 类型 | 是否为空 | 键 | 默认值 | 说明 |
|--------|------|----------|-----|--------|------|
| id | int | NO | PRI |  | auto_increment |
| user_id | int | NO | MUL |  |  |
| token | varchar(255) | NO | MUL |  |  |
| expires_at | timestamp | NO | MUL |  |  |
| used | tinyint(1) | YES |  | 0 |  |
| created_at | timestamp | YES |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED |

### tags 

| 字段名 | 类型 | 是否为空 | 键 | 默认值 | 说明 |
|--------|------|----------|-----|--------|------|
| id | int | NO | PRI |  | auto_increment |
| name | varchar(30) | NO | UNI |  |  |
| color | varchar(7) | YES |  | #3B82F6 |  |
| created_at | timestamp | YES |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED |

### user_sessions - 用户会话表

| 字段名 | 类型 | 是否为空 | 键 | 默认值 | 说明 |
|--------|------|----------|-----|--------|------|
| id | int | NO | PRI |  | auto_increment |
| user_id | int | NO | MUL |  |  |
| token_hash | varchar(255) | NO | MUL |  |  |
| device_info | varchar(255) | YES |  |  |  |
| ip_address | varchar(45) | YES |  |  |  |
| user_agent | text | YES |  |  |  |
| expires_at | timestamp | NO | MUL |  |  |
| created_at | timestamp | YES |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED |

### users - 用户表

| 字段名 | 类型 | 是否为空 | 键 | 默认值 | 说明 |
|--------|------|----------|-----|--------|------|
| id | int | NO | PRI |  | auto_increment |
| username | varchar(50) | NO | UNI |  |  |
| email | varchar(100) | NO | UNI |  |  |
| password_hash | varchar(255) | NO |  |  |  |
| nickname | varchar(50) | YES |  |  |  |
| avatar | varchar(255) | YES |  |  |  |
| bio | text | YES |  |  |  |
| role | enum('admin','user') | YES |  | user |  |
| status | enum('active','inactive','banned') | YES | MUL | active |  |
| email_verified | tinyint(1) | YES |  | 0 |  |
| last_login_at | timestamp | YES |  |  |  |
| created_at | timestamp | YES |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| updated_at | timestamp | YES |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |

