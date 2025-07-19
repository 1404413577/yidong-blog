const Tag = require('../models/Tag');
const { success, errors, paginate } = require('../utils/response');

class TagController {
  /**
   * 获取标签列表
   */
  static async getList(ctx) {
    try {
      const tags = await Tag.getAll();
      ctx.body = success(tags);
    } catch (error) {
      console.error('获取标签列表失败:', error);
      ctx.body = errors.serverError('获取标签列表失败');
    }
  }

  /**
   * 获取热门标签
   */
  static async getPopular(ctx) {
    try {
      const { limit = 10 } = ctx.query;
      const limitNum = parseInt(limit);

      if (limitNum < 1 || limitNum > 50) {
        ctx.body = errors.badRequest('限制数量参数错误');
        return;
      }

      const tags = await Tag.getPopular(limitNum);
      ctx.body = success(tags);
    } catch (error) {
      console.error('获取热门标签失败:', error);
      ctx.body = errors.serverError('获取热门标签失败');
    }
  }

  /**
   * 获取标签详情
   */
  static async getDetail(ctx) {
    try {
      const { id } = ctx.params;
      const tagId = parseInt(id);

      if (!tagId || tagId < 1) {
        ctx.body = errors.badRequest('标签ID无效');
        return;
      }

      const tag = await Tag.getById(tagId);

      if (!tag) {
        ctx.body = errors.notFound('标签不存在');
        return;
      }

      ctx.body = success(tag);
    } catch (error) {
      console.error('获取标签详情失败:', error);
      ctx.body = errors.serverError('获取标签详情失败');
    }
  }

  /**
   * 获取标签下的文章
   */
  static async getArticles(ctx) {
    try {
      const { id } = ctx.params;
      const { page = 1, pageSize = 10 } = ctx.query;

      const tagId = parseInt(id);
      const pageNum = parseInt(page);
      const pageSizeNum = parseInt(pageSize);

      // 参数验证
      if (!tagId || tagId < 1) {
        ctx.body = errors.badRequest('标签ID无效');
        return;
      }

      if (pageNum < 1 || pageSizeNum < 1 || pageSizeNum > 50) {
        ctx.body = errors.badRequest('分页参数错误');
        return;
      }

      // 检查标签是否存在
      const tag = await Tag.getById(tagId);
      if (!tag) {
        ctx.body = errors.notFound('标签不存在');
        return;
      }

      const result = await Tag.getArticles(tagId, {
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
      console.error('获取标签文章失败:', error);
      ctx.body = errors.serverError('获取标签文章失败');
    }
  }
}

module.exports = TagController;
