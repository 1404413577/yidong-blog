const Article = require('../models/Article');
const { success, errors, paginate } = require('../utils/response');

class ArticleController {
  /**
   * 获取文章列表
   */
  static async getList(ctx) {
    try {
      const {
        page = 1,
        pageSize = 10,
        categoryId,
        featured
      } = ctx.query;

      // 参数验证
      const pageNum = parseInt(page);
      const pageSizeNum = parseInt(pageSize);

      if (pageNum < 1 || pageSizeNum < 1 || pageSizeNum > 50) {
        ctx.body = errors.badRequest('分页参数错误');
        return;
      }

      const options = {
        page: pageNum,
        pageSize: pageSizeNum
      };

      // 分类筛选
      if (categoryId) {
        const categoryIdNum = parseInt(categoryId);
        if (categoryIdNum > 0) {
          options.categoryId = categoryIdNum;
        }
      }

      // 精选筛选
      if (featured !== undefined) {
        options.featured = featured === 'true';
      }

      const result = await Article.getList(options);

      ctx.body = paginate(
        result.articles,
        result.total,
        pageNum,
        pageSizeNum
      );
    } catch (error) {
      console.error('获取文章列表失败:', error);
      ctx.body = errors.serverError('获取文章列表失败');
    }
  }

  /**
   * 获取文章详情
   */
  static async getDetail(ctx) {
    try {
      const { id } = ctx.params;
      const articleId = parseInt(id);

      if (!articleId || articleId < 1) {
        ctx.body = errors.badRequest('文章ID无效');
        return;
      }

      const article = await Article.getById(articleId);

      if (!article) {
        ctx.body = errors.notFound('文章不存在');
        return;
      }

      // 获取相关文章
      const relatedArticles = await Article.getRelated(
        articleId,
        article.category_id,
        5
      );

      ctx.body = success({
        article,
        relatedArticles
      });
    } catch (error) {
      console.error('获取文章详情失败:', error);
      ctx.body = errors.serverError('获取文章详情失败');
    }
  }

  /**
   * 增加文章浏览量
   */
  static async incrementView(ctx) {
    try {
      const { id } = ctx.params;
      const articleId = parseInt(id);

      if (!articleId || articleId < 1) {
        ctx.body = errors.badRequest('文章ID无效');
        return;
      }

      // 检查文章是否存在
      const article = await Article.getById(articleId);
      if (!article) {
        ctx.body = errors.notFound('文章不存在');
        return;
      }

      await Article.incrementViewCount(articleId);

      ctx.body = success(null, '浏览量更新成功');
    } catch (error) {
      console.error('更新浏览量失败:', error);
      ctx.body = errors.serverError('更新浏览量失败');
    }
  }

  /**
   * 获取精选文章
   */
  static async getFeatured(ctx) {
    try {
      const { limit = 5 } = ctx.query;
      const limitNum = parseInt(limit);

      if (limitNum < 1 || limitNum > 20) {
        ctx.body = errors.badRequest('限制数量参数错误');
        return;
      }

      const result = await Article.getList({
        page: 1,
        pageSize: limitNum,
        featured: true
      });

      ctx.body = success(result.articles);
    } catch (error) {
      console.error('获取精选文章失败:', error);
      ctx.body = errors.serverError('获取精选文章失败');
    }
  }
}

module.exports = ArticleController;
