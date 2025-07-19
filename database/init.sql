-- 创建数据库
CREATE DATABASE IF NOT EXISTS yidong_blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE yidong_blog;

-- 分类表
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE COMMENT '分类名称',
  description TEXT COMMENT '分类描述',
  sort_order INT DEFAULT 0 COMMENT '排序权重',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章分类表';

-- 标签表
CREATE TABLE IF NOT EXISTS tags (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL UNIQUE COMMENT '标签名称',
  color VARCHAR(7) DEFAULT '#3B82F6' COMMENT '标签颜色',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章标签表';

-- 文章表
CREATE TABLE IF NOT EXISTS articles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL COMMENT '文章标题',
  content LONGTEXT NOT NULL COMMENT '文章内容(Markdown)',
  summary TEXT COMMENT '文章摘要',
  cover_image VARCHAR(255) COMMENT '封面图片URL',
  category_id INT COMMENT '分类ID',
  status ENUM('draft', 'published') DEFAULT 'published' COMMENT '文章状态',
  is_featured BOOLEAN DEFAULT FALSE COMMENT '是否精选',
  view_count INT DEFAULT 0 COMMENT '浏览次数',
  like_count INT DEFAULT 0 COMMENT '点赞次数',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_category (category_id),
  INDEX idx_created_at (created_at),
  INDEX idx_featured (is_featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章表';

-- 文章标签关联表
CREATE TABLE IF NOT EXISTS article_tags (
  article_id INT NOT NULL COMMENT '文章ID',
  tag_id INT NOT NULL COMMENT '标签ID',
  PRIMARY KEY (article_id, tag_id),
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章标签关联表';

-- 插入初始数据
INSERT INTO categories (name, description, sort_order) VALUES
('技术分享', '分享编程技术和开发经验', 1),
('生活随笔', '记录生活中的点点滴滴', 2),
('学习笔记', '学习过程中的总结和思考', 3),
('项目实战', '实际项目开发经验分享', 4);

INSERT INTO tags (name, color) VALUES
('Vue.js', '#4FC08D'),
('JavaScript', '#F7DF1E'),
('Node.js', '#339933'),
('MySQL', '#4479A1'),
('前端开发', '#61DAFB'),
('后端开发', '#FF6B6B'),
('移动端', '#FF9500'),
('博客', '#8B5CF6');

-- 插入示例文章
INSERT INTO articles (title, content, summary, category_id, is_featured) VALUES
('欢迎来到我的博客', 
'# 欢迎来到我的个人博客

这是我的第一篇博客文章，很高兴能够与大家分享我的技术学习和生活感悟。

## 关于这个博客

这个博客是基于以下技术栈构建的：

- **前端**: Vue 3 + Vite + JavaScript
- **后端**: Koa.js + MySQL
- **特色**: 移动端优先设计，支持暗黑模式

## 未来计划

我会在这里分享：

1. 技术学习笔记
2. 项目开发经验
3. 生活感悟和思考
4. 有趣的发现和工具推荐

感谢你的访问，希望我的分享对你有所帮助！', 
'欢迎来到我的个人博客，这里会分享技术学习、项目经验和生活感悟。', 
1, 
TRUE),

('Vue 3 Composition API 实践指南', 
'# Vue 3 Composition API 实践指南

Vue 3 的 Composition API 为我们提供了更灵活的组件逻辑组织方式。

## 基本用法

```javascript
import { ref, reactive, computed, onMounted } from ''vue''

export default {
  setup() {
    const count = ref(0)
    const state = reactive({
      name: ''Vue 3'',
      version: ''3.0''
    })
    
    const doubleCount = computed(() => count.value * 2)
    
    onMounted(() => {
      console.log(''组件已挂载'')
    })
    
    return {
      count,
      state,
      doubleCount
    }
  }
}
```

## 优势

1. 更好的逻辑复用
2. 更清晰的代码组织
3. 更好的 TypeScript 支持

这只是一个开始，后续会有更多深入的内容分享。', 
'深入了解 Vue 3 Composition API 的使用方法和最佳实践。', 
1, 
FALSE);

-- 为示例文章添加标签
INSERT INTO article_tags (article_id, tag_id) VALUES
(1, 7), -- 移动端
(1, 8), -- 博客
(2, 1), -- Vue.js
(2, 2), -- JavaScript
(2, 5); -- 前端开发
