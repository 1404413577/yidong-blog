# 移动端博客系统数据库脚本

本目录包含移动端博客系统的数据库相关脚本和文档。

## 文件说明

### 1. `database-structure.sql`
- **用途**: 完整的数据库表结构 SQL 文件
- **内容**: 包含所有表的创建语句，可用于快速搭建数据库
- **使用方法**: 
  ```bash
  mysql -u root -p your_database_name < database-structure.sql
  ```

### 2. `database-info.md`
- **用途**: 数据库表结构说明文档
- **内容**: 详细的表结构信息，包括字段类型、约束等
- **适用于**: 开发文档、数据库设计参考

### 3. `export-database.js`
- **用途**: 数据库表结构导出脚本
- **功能**: 自动导出当前数据库的表结构为 SQL 和 Markdown 格式
- **使用方法**:
  ```bash
  cd script
  node export-database.js
  ```

## 数据库概览

移动端博客系统包含以下 7 个核心数据表：

1. **users** - 用户表
   - 存储用户基本信息、认证信息
   - 支持头像、昵称、邮箱等字段

2. **articles** - 文章表
   - 存储博客文章内容
   - 支持草稿/发布状态、分类、标签关联
   - 包含浏览量、点赞数等统计信息

3. **categories** - 分类表
   - 文章分类管理
   - 支持排序和描述

4. **tags** - 标签表
   - 文章标签管理
   - 多对多关联文章

5. **article_tags** - 文章标签关联表
   - 实现文章和标签的多对多关系

6. **user_sessions** - 用户会话表
   - 管理用户登录会话
   - 支持会话过期和安全控制

7. **password_resets** - 密码重置表
   - 处理用户密码重置请求
   - 包含安全令牌和过期时间

## 特性

- **完整的外键约束**: 确保数据一致性
- **UTF8MB4 编码**: 支持 emoji 和特殊字符
- **时间戳自动更新**: 自动记录创建和更新时间
- **索引优化**: 针对查询性能进行了索引设计
- **安全设计**: 密码加密、会话管理等安全机制

## 使用说明

### 初始化数据库

1. 创建数据库：
   ```sql
   CREATE DATABASE yidong_blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. 导入表结构：
   ```bash
   mysql -u root -p yidong_blog < database-structure.sql
   ```

3. 配置环境变量（参考 backend/.env.example）

### 更新表结构

如果数据库结构有变化，可以重新运行导出脚本：

```bash
cd script
node export-database.js
```

这将生成最新的表结构文件。

## 注意事项

- 导出脚本需要数据库连接，确保后端环境变量配置正确
- SQL 文件包含 `DROP TABLE` 语句，导入时请注意数据备份
- 建议在开发环境中测试表结构变更后再应用到生产环境
