const Article = require('../models/Article');
const Category = require('../models/Category');
const Tag = require('../models/Tag');
const { query } = require('../config/database');

class AdminController {
  /**
   * 获取管理后台统计数据
   */
  static async getDashboardStats(ctx) {
    try {
      const userId = ctx.user.id;

      // 获取文章统计
      const [articleStats] = await query(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
          SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft,
          SUM(view_count) as total_views,
          SUM(like_count) as total_likes
        FROM articles 
        WHERE author_id = ?
      `, [userId]);

      // 获取分类统计
      const [categoryStats] = await query(`
        SELECT COUNT(*) as total FROM categories
      `);

      // 获取标签统计
      const [tagStats] = await query(`
        SELECT COUNT(*) as total FROM tags
      `);

      // 获取最近7天的文章浏览量统计
      const viewStats = await query(`
        SELECT 
          DATE(created_at) as date,
          SUM(view_count) as views
        FROM articles 
        WHERE author_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `, [userId]);

      ctx.body = {
        success: true,
        data: {
          articles: {
            total: articleStats.total || 0,
            published: articleStats.published || 0,
            draft: articleStats.draft || 0
          },
          categories: categoryStats.total || 0,
          tags: tagStats.total || 0,
          views: {
            total: articleStats.total_views || 0,
            recent: viewStats
          },
          likes: articleStats.total_likes || 0
        }
      };
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: '获取统计数据失败'
      };
    }
  }

  /**
   * 创建文章
   */
  static async createArticle(ctx) {
    try {
      const { title, content, summary, cover_image, category_id, tags, status = 'draft', is_featured = false } = ctx.request.body;
      const authorId = ctx.user.id;

      if (!title || !content) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: '标题和内容不能为空'
        };
        return;
      }

      // 创建文章
      const articleResult = await query(`
        INSERT INTO articles (author_id, title, content, summary, cover_image, category_id, status, is_featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [authorId, title, content, summary, cover_image, category_id, status, is_featured ? 1 : 0]);

      const articleId = articleResult.insertId;

      // 处理标签
      if (tags && Array.isArray(tags) && tags.length > 0) {
        for (const tagId of tags) {
          await query('INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)', [articleId, tagId]);
        }
      }

      // 获取创建的文章详情
      const article = await Article.getById(articleId);

      ctx.body = {
        success: true,
        message: '文章创建成功',
        data: { article }
      };
    } catch (error) {
      console.error('Create article error:', error);
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: '创建文章失败'
      };
    }
  }

  /**
   * 更新文章
   */
  static async updateArticle(ctx) {
    try {
      const articleId = ctx.params.id;
      const { title, content, summary, cover_image, category_id, tags, status, is_featured } = ctx.request.body;
      const authorId = ctx.user.id;

      // 检查文章是否存在且属于当前用户
      const existingArticle = await query('SELECT * FROM articles WHERE id = ? AND author_id = ?', [articleId, authorId]);
      if (existingArticle.length === 0) {
        ctx.status = 404;
        ctx.body = {
          success: false,
          message: '文章不存在或无权限编辑'
        };
        return;
      }

      // 更新文章
      const updateFields = [];
      const updateValues = [];

      if (title !== undefined) {
        updateFields.push('title = ?');
        updateValues.push(title);
      }
      if (content !== undefined) {
        updateFields.push('content = ?');
        updateValues.push(content);
      }
      if (summary !== undefined) {
        updateFields.push('summary = ?');
        updateValues.push(summary);
      }
      if (cover_image !== undefined) {
        updateFields.push('cover_image = ?');
        updateValues.push(cover_image);
      }
      if (category_id !== undefined) {
        updateFields.push('category_id = ?');
        updateValues.push(category_id);
      }
      if (status !== undefined) {
        updateFields.push('status = ?');
        updateValues.push(status);
      }
      if (is_featured !== undefined) {
        updateFields.push('is_featured = ?');
        updateValues.push(is_featured ? 1 : 0);
      }

      if (updateFields.length > 0) {
        updateFields.push('updated_at = NOW()');
        updateValues.push(articleId);
        
        await query(`UPDATE articles SET ${updateFields.join(', ')} WHERE id = ?`, updateValues);
      }

      // 更新标签
      if (tags !== undefined && Array.isArray(tags)) {
        // 删除现有标签关联
        await query('DELETE FROM article_tags WHERE article_id = ?', [articleId]);
        
        // 添加新标签关联
        for (const tagId of tags) {
          await query('INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)', [articleId, tagId]);
        }
      }

      // 获取更新后的文章详情
      const article = await Article.getById(articleId);

      ctx.body = {
        success: true,
        message: '文章更新成功',
        data: { article }
      };
    } catch (error) {
      console.error('Update article error:', error);
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: '更新文章失败'
      };
    }
  }

  /**
   * 删除文章
   */
  static async deleteArticle(ctx) {
    try {
      const articleId = ctx.params.id;
      const authorId = ctx.user.id;

      // 检查文章是否存在且属于当前用户
      const existingArticle = await query('SELECT * FROM articles WHERE id = ? AND author_id = ?', [articleId, authorId]);
      if (existingArticle.length === 0) {
        ctx.status = 404;
        ctx.body = {
          success: false,
          message: '文章不存在或无权限删除'
        };
        return;
      }

      // 删除文章标签关联
      await query('DELETE FROM article_tags WHERE article_id = ?', [articleId]);
      
      // 删除文章
      await query('DELETE FROM articles WHERE id = ?', [articleId]);

      ctx.body = {
        success: true,
        message: '文章删除成功'
      };
    } catch (error) {
      console.error('Delete article error:', error);
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: '删除文章失败'
      };
    }
  }

  /**
   * 获取用户的文章列表（管理后台用）
   */
  static async getMyArticles(ctx) {
    try {
      const { page = 1, pageSize = 10, status, keyword } = ctx.query;
      const authorId = ctx.user.id;
      const offset = (page - 1) * pageSize;

      let whereConditions = ['a.author_id = ?'];
      let params = [authorId];

      if (status) {
        whereConditions.push('a.status = ?');
        params.push(status);
      }

      if (keyword) {
        whereConditions.push('(a.title LIKE ? OR a.content LIKE ?)');
        params.push(`%${keyword}%`, `%${keyword}%`);
      }

      const whereClause = whereConditions.join(' AND ');

      const listSql = `
        SELECT
          a.id,
          a.title,
          a.summary,
          a.cover_image,
          a.status,
          a.is_featured,
          a.view_count,
          a.like_count,
          a.created_at,
          a.updated_at,
          c.name as category_name,
          c.id as category_id
        FROM articles a
        LEFT JOIN categories c ON a.category_id = c.id
        WHERE ${whereClause}
        ORDER BY a.updated_at DESC
        LIMIT ${pageSize} OFFSET ${offset}
      `;

      const countSql = `
        SELECT COUNT(*) as total
        FROM articles a
        WHERE ${whereClause}
      `;

      const [articles, countResult] = await Promise.all([
        query(listSql, params),
        query(countSql, params)
      ]);

      const total = countResult[0]?.total || 0;
      const totalPages = Math.ceil(total / pageSize);

      ctx.body = {
        success: true,
        data: {
          articles,
          pagination: {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            total,
            totalPages
          }
        }
      };
    } catch (error) {
      console.error('Get my articles error:', error);
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: '获取文章列表失败'
      };
    }
  }
}

module.exports = AdminController;
