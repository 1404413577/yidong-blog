const { query } = require('../config/database');

class Article {
  /**
   * 获取文章列表
   * @param {Object} options - 查询选项
   * @param {number} options.page - 页码
   * @param {number} options.pageSize - 每页数量
   * @param {number} options.categoryId - 分类ID
   * @param {string} options.status - 文章状态
   * @param {boolean} options.featured - 是否精选
   */
  static async getList(options = {}) {
    const {
      page = 1,
      pageSize = 10,
      categoryId,
      status = 'published',
      featured
    } = options;

    const offset = (page - 1) * pageSize;
    let whereConditions = ['a.status = ?'];
    let params = [status];

    // 分类筛选
    if (categoryId) {
      whereConditions.push('a.category_id = ?');
      params.push(categoryId);
    }

    // 精选筛选
    if (featured !== undefined) {
      whereConditions.push('a.is_featured = ?');
      params.push(featured);
    }

    const whereClause = whereConditions.join(' AND ');

    // 查询文章列表
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
        c.id as category_id,
        GROUP_CONCAT(
          JSON_OBJECT('id', t.id, 'name', t.name, 'color', t.color)
        ) as tags
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      LEFT JOIN article_tags at ON a.id = at.article_id
      LEFT JOIN tags t ON at.tag_id = t.id
      WHERE ${whereClause}
      GROUP BY a.id
      ORDER BY a.is_featured DESC, a.created_at DESC
      LIMIT ? OFFSET ?
    `;

    // 查询总数
    const countSql = `
      SELECT COUNT(*) as total
      FROM articles a
      WHERE ${whereClause}
    `;

    const [articles, countResult] = await Promise.all([
      query(listSql, [...params, pageSize, offset]),
      query(countSql, params)
    ]);

    // 处理标签数据
    const processedArticles = articles.map(article => ({
      ...article,
      tags: article.tags ? JSON.parse(`[${article.tags}]`) : []
    }));

    return {
      articles: processedArticles,
      total: countResult[0].total
    };
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
        c.id as category_id,
        GROUP_CONCAT(
          JSON_OBJECT('id', t.id, 'name', t.name, 'color', t.color)
        ) as tags
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      LEFT JOIN article_tags at ON a.id = at.article_id
      LEFT JOIN tags t ON at.tag_id = t.id
      WHERE a.id = ? AND a.status = 'published'
      GROUP BY a.id
    `;

    const result = await query(sql, [id]);
    
    if (result.length === 0) {
      return null;
    }

    const article = result[0];
    return {
      ...article,
      tags: article.tags ? JSON.parse(`[${article.tags}]`) : []
    };
  }

  /**
   * 增加文章浏览量
   * @param {number} id - 文章ID
   */
  static async incrementViewCount(id) {
    const sql = 'UPDATE articles SET view_count = view_count + 1 WHERE id = ?';
    await query(sql, [id]);
  }

  /**
   * 获取相关文章
   * @param {number} articleId - 当前文章ID
   * @param {number} categoryId - 分类ID
   * @param {number} limit - 限制数量
   */
  static async getRelated(articleId, categoryId, limit = 5) {
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
      WHERE a.id != ? 
        AND a.category_id = ? 
        AND a.status = 'published'
      ORDER BY a.created_at DESC
      LIMIT ?
    `;

    return await query(sql, [articleId, categoryId, limit]);
  }
}

module.exports = Article;
