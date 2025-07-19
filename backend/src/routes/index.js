const Router = require('koa-router');
const ArticleController = require('../controllers/articleController');
const CategoryController = require('../controllers/categoryController');
const TagController = require('../controllers/tagController');

// 导入认证路由
const authRoutes = require('./auth');

const router = new Router({
  prefix: '/api'
});

// 文章相关路由
router.get('/articles', ArticleController.getList);
router.get('/articles/featured', ArticleController.getFeatured);
router.get('/articles/:id', ArticleController.getDetail);
router.put('/articles/:id/view', ArticleController.incrementView);

// 分类相关路由
router.get('/categories', CategoryController.getList);
router.get('/categories/:id', CategoryController.getDetail);
router.get('/categories/:id/articles', CategoryController.getArticles);

// 标签相关路由
router.get('/tags', TagController.getList);
router.get('/tags/popular', TagController.getPopular);
router.get('/tags/:id', TagController.getDetail);
router.get('/tags/:id/articles', TagController.getArticles);

// 健康检查
router.get('/health', async (ctx) => {
  ctx.body = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  };
});

module.exports = router;
