const Category = require('../models/Category');
const { success, errors, paginate } = require('../utils/response');

class CategoryController {
  /**
   * 获取分类列表
   */
  static async getList(ctx) {
    try {
      const categories = await Category.getAll();
      ctx.body = success(categories);
    } catch (error) {
      console.error('获取分类列表失败:', error);
      ctx.body = errors.serverError('获取分类列表失败');
    }
  }

  /**
   * 获取分类详情
   */
  static async getDetail(ctx) {
    try {
      const { id } = ctx.params;
      const categoryId = parseInt(id);

      if (!categoryId || categoryId < 1) {
        ctx.body = errors.badRequest('分类ID无效');
        return;
      }

      const category = await Category.getById(categoryId);

      if (!category) {
        ctx.body = errors.notFound('分类不存在');
        return;
      }

      ctx.body = success(category);
    } catch (error) {
      console.error('获取分类详情失败:', error);
      ctx.body = errors.serverError('获取分类详情失败');
    }
  }

  /**
   * 获取分类下的文章
   */
  static async getArticles(ctx) {
    try {
      const { id } = ctx.params;
      const { page = 1, pageSize = 10 } = ctx.query;

      const categoryId = parseInt(id);
      const pageNum = parseInt(page);
      const pageSizeNum = parseInt(pageSize);

      // 参数验证
      if (!categoryId || categoryId < 1) {
        ctx.body = errors.badRequest('分类ID无效');
        return;
      }

      if (pageNum < 1 || pageSizeNum < 1 || pageSizeNum > 50) {
        ctx.body = errors.badRequest('分页参数错误');
        return;
      }

      // 检查分类是否存在
      const category = await Category.getById(categoryId);
      if (!category) {
        ctx.body = errors.notFound('分类不存在');
        return;
      }

      const result = await Category.getArticles(categoryId, {
        page: pageNum,
        pageSize: pageSizeNum
      });

      ctx.body = paginate(
        result.articles,
        result.total,
        pageNum,
        pageSizeNum
      );
    } catch (error) {
      console.error('获取分类文章失败:', error);
      ctx.body = errors.serverError('获取分类文章失败');
    }
  }
}

module.exports = CategoryController;
