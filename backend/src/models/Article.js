const { query } = require('../config/database');

class Article {
  /**
   * 获取文章列表
   * @param {Object} options - 查询选项
   * @param {number} options.page - 页码
   * @param {number} options.pageSize - 每页数量
   * @param {number} options.categoryId - 分类ID
   * @param {boolean} options.featured - 是否精选
   * @param {string} options.status - 状态
   */
  static async getList(options = {}) {
    try {
      const {
        page = 1,
        pageSize = 10,
        categoryId,
        featured,
        status = 'published'
      } = options;

      const offset = (page - 1) * pageSize;

      // 使用最简单的方法，避免占位符问题
      let whereConditions = [`a.status = '${status}'`];
      
      if (categoryId) {
        whereConditions.push(`a.category_id = ${categoryId}`);
      }
      
      if (featured !== undefined) {
        whereConditions.push(`a.is_featured = ${featured ? 1 : 0}`);
      }
      
      const whereClause = whereConditions.join(' AND ');

      const listSql = `
        SELECT
          a.id,
          a.title,
          a.summary,
          a.cover_image,
          a.view_count,
          a.like_count,
          a.is_featured,
          a.created_at,
          a.updated_at,
          c.name as category_name,
          c.id as category_id
        FROM articles a
        LEFT JOIN categories c ON a.category_id = c.id
        WHERE ${whereClause}
        ORDER BY a.is_featured DESC, a.created_at DESC
        LIMIT ${pageSize} OFFSET ${offset}
      `;
      
      const countSql = `
        SELECT COUNT(*) as total
        FROM articles a
        WHERE ${whereClause}
      `;

      console.log('SQL查询调试:');
      console.log('listSql:', listSql);
      console.log('countSql:', countSql);

      const [articles, countResult] = await Promise.all([
        query(listSql, []),
        query(countSql, [])
      ]);

      const total = countResult[0]?.total || 0;
      const totalPages = Math.ceil(total / pageSize);

      // 获取每篇文章的标签
      for (let article of articles) {
        const tagsSql = `
          SELECT t.id, t.name, t.color
          FROM tags t
          JOIN article_tags at ON t.id = at.tag_id
          WHERE at.article_id = ${article.id}
        `;
        const tags = await query(tagsSql, []);
        article.tags = tags;
      }

      return {
        articles,
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          total,
          totalPages
        }
      };
    } catch (error) {
      console.error('Article.getList error:', error);
      throw error;
    }
  }

  /**
   * 根据ID获取文章详情
   * @param {number} id - 文章ID
   */
  static async getById(id) {
    const sql = `
      SELECT 
        a.*,
        c.name as category_name,
        c.id as category_id
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.id = ${id}
    `;

    const articles = await query(sql, []);
    if (articles.length === 0) {
      return null;
    }

    const article = articles[0];

    // 获取标签
    const tagsSql = `
      SELECT t.id, t.name, t.color
      FROM tags t
      JOIN article_tags at ON t.id = at.tag_id
      WHERE at.article_id = ${id}
    `;
    const tags = await query(tagsSql, []);
    article.tags = tags;

    return article;
  }

  /**
   * 增加浏览量
   * @param {number} id - 文章ID
   */
  static async incrementViewCount(id) {
    const sql = `UPDATE articles SET view_count = view_count + 1 WHERE id = ${id}`;
    return await query(sql, []);
  }

  /**
   * 获取相关文章
   * @param {number} articleId - 当前文章ID
   * @param {number} categoryId - 分类ID
   * @param {number} limit - 限制数量
   */
  static async getRelated(articleId, categoryId, limit = 5) {
    try {
      const sql = `
        SELECT 
          a.id,
          a.title,
          a.summary,
          a.cover_image,
          a.created_at,
          c.name as category_name
        FROM articles a
        LEFT JOIN categories c ON a.category_id = c.id
        WHERE a.id != ${articleId} 
          AND a.category_id = ${categoryId} 
          AND a.status = 'published'
        ORDER BY a.created_at DESC
        LIMIT ${limit}
      `;

      return await query(sql, []);
    } catch (error) {
      console.error('Article.getRelated error:', error);
      return [];
    }
  }
}

module.exports = Article;
