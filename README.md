# 移动端个人博客项目

一个基于 Vue 3 + Koa.js 的移动端优先个人博客系统。

## 技术栈

### 前端
- Vue 3 + Composition API
- Vite 构建工具
- Vue Router 路由管理
- Pinia 状态管理
- JavaScript (纯JS，不使用TypeScript)

### 后端
- Koa.js 框架
- MySQL 数据库
- JavaScript

### 特性
- 📱 移动端优先设计
- 🌙 暗黑模式支持
- ✨ 流畅动画效果
- 📝 Markdown 文章支持
- 🏷️ 分类和标签系统
- 🎨 现代化UI设计

## 项目结构

```
yidong-blog/
├── frontend/           # Vue 3 前端项目
├── backend/           # Koa.js 后端项目
├── database/          # 数据库初始化脚本
└── README.md
```

## 快速开始

### 1. 安装依赖

```bash
# 前端依赖
cd frontend
npm install

# 后端依赖
cd ../backend
npm install
```

### 2. 数据库配置

```bash
# 创建数据库并导入初始化脚本
mysql -u root -p0519 < database/init.sql
```

### 3. 启动项目

```bash
# 启动后端服务 (端口: 3000)
cd backend
npm run dev

# 启动前端服务 (端口: 5173)
cd frontend
npm run dev
```

## 开发计划

- [x] 项目结构搭建
- [ ] 数据库设计和初始化
- [ ] 后端API开发
- [ ] 前端基础框架
- [ ] 核心功能实现
- [ ] UI优化和动画效果
- [ ] 移动端适配
- [ ] 测试和部署

## 作者

刘明渊 - 个人博客项目

git remote add origin https://gitee.com/hailang123/yidong-blog.git

git remote add origin https://github.com/1404413577/yidong-blog.git