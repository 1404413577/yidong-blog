const { query } = require('../config/database');

class Category {
  /**
   * 获取所有分类列表
   */
  static async getAll() {
    const sql = `
      SELECT 
        c.*,
        COUNT(a.id) as article_count
      FROM categories c
      LEFT JOIN articles a ON c.id = a.category_id AND a.status = 'published'
      GROUP BY c.id
      ORDER BY c.sort_order ASC, c.created_at ASC
    `;

    return await query(sql);
  }

  /**
   * 根据ID获取分类信息
   * @param {number} id - 分类ID
   */
  static async getById(id) {
    const sql = 'SELECT * FROM categories WHERE id = ?';
    const result = await query(sql, [id]);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * 获取分类下的文章
   * @param {number} categoryId - 分类ID
   * @param {Object} options - 查询选项
   */
  static async getArticles(categoryId, options = {}) {
    const { page = 1, pageSize = 10 } = options;
    const offset = (page - 1) * pageSize;

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
        GROUP_CONCAT(
          JSON_OBJECT('id', t.id, 'name', t.name, 'color', t.color)
        ) as tags
      FROM articles a
      LEFT JOIN article_tags at ON a.id = at.article_id
      LEFT JOIN tags t ON at.tag_id = t.id
      WHERE a.category_id = ? AND a.status = 'published'
      GROUP BY a.id
      ORDER BY a.is_featured DESC, a.created_at DESC
      LIMIT ? OFFSET ?
    `;

    // 查询总数
    const countSql = `
      SELECT COUNT(*) as total
      FROM articles
      WHERE category_id = ? AND status = 'published'
    `;

    const [articles, countResult] = await Promise.all([
      query(listSql, [categoryId, pageSize, offset]),
      query(countSql, [categoryId])
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
}

module.exports = Category;
