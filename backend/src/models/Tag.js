const { query } = require('../config/database');

class Tag {
  /**
   * 获取所有标签列表
   */
  static async getAll() {
    const sql = `
      SELECT 
        t.*,
        COUNT(at.article_id) as article_count
      FROM tags t
      LEFT JOIN article_tags at ON t.id = at.tag_id
      LEFT JOIN articles a ON at.article_id = a.id AND a.status = 'published'
      GROUP BY t.id
      ORDER BY article_count DESC, t.created_at ASC
    `;

    return await query(sql);
  }

  /**
   * 根据ID获取标签信息
   * @param {number} id - 标签ID
   */
  static async getById(id) {
    const sql = 'SELECT * FROM tags WHERE id = ?';
    const result = await query(sql, [id]);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * 获取标签下的文章
   * @param {number} tagId - 标签ID
   * @param {Object} options - 查询选项
   */
  static async getArticles(tagId, options = {}) {
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
        c.name as category_name,
        c.id as category_id,
        GROUP_CONCAT(
          DISTINCT JSON_OBJECT('id', t2.id, 'name', t2.name, 'color', t2.color)
        ) as tags
      FROM articles a
      INNER JOIN article_tags at ON a.id = at.article_id
      LEFT JOIN categories c ON a.category_id = c.id
      LEFT JOIN article_tags at2 ON a.id = at2.article_id
      LEFT JOIN tags t2 ON at2.tag_id = t2.id
      WHERE at.tag_id = ? AND a.status = 'published'
      GROUP BY a.id
      ORDER BY a.is_featured DESC, a.created_at DESC
      LIMIT ? OFFSET ?
    `;

    // 查询总数
    const countSql = `
      SELECT COUNT(DISTINCT a.id) as total
      FROM articles a
      INNER JOIN article_tags at ON a.id = at.article_id
      WHERE at.tag_id = ? AND a.status = 'published'
    `;

    const [articles, countResult] = await Promise.all([
      query(listSql, [tagId, pageSize, offset]),
      query(countSql, [tagId])
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
   * 获取热门标签
   * @param {number} limit - 限制数量
   */
  static async getPopular(limit = 10) {
    const sql = `
      SELECT 
        t.*,
        COUNT(at.article_id) as article_count
      FROM tags t
      INNER JOIN article_tags at ON t.id = at.tag_id
      INNER JOIN articles a ON at.article_id = a.id AND a.status = 'published'
      GROUP BY t.id
      HAVING article_count > 0
      ORDER BY article_count DESC, t.created_at ASC
      LIMIT ?
    `;

    return await query(sql, [limit]);
  }
}

module.exports = Tag;
