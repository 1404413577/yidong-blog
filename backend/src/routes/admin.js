const Router = require('koa-router');
const AdminController = require('../controllers/adminController');
const CategoryController = require('../controllers/categoryController');
const TagController = require('../controllers/tagController');
const { authenticate, authorize } = require('../middleware/auth');
const { uploadArticleImage, getFileUrl } = require('../middleware/upload');
const { query } = require('../config/database');

const router = new Router({
  prefix: '/api/admin'
});

// 所有管理后台路由都需要认证
router.use(authenticate);

// 获取仪表板统计数据
router.get('/dashboard/stats', AdminController.getDashboardStats);

// 文章管理
router.get('/articles', AdminController.getMyArticles);
router.post('/articles', AdminController.createArticle);
router.put('/articles/:id', AdminController.updateArticle);
router.delete('/articles/:id', AdminController.deleteArticle);

// 图片上传
router.post('/upload/image', uploadArticleImage, async (ctx) => {
  try {
    if (!ctx.req.file) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: '请选择要上传的图片文件'
      };
      return;
    }

    const filename = ctx.req.file.filename;
    const imageUrl = getFileUrl(filename, 'article');

    ctx.body = {
      success: true,
      message: '图片上传成功',
      data: {
        url: imageUrl,
        filename: filename
      }
    };
  } catch (error) {
    console.error('Upload image error:', error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: '图片上传失败'
    };
  }
});

// 分类管理
router.get('/categories', CategoryController.getList);
router.post('/categories', authorize(['admin']), async (ctx) => {
  try {
    const { name, description, color } = ctx.request.body;

    if (!name) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: '分类名称不能为空'
      };
      return;
    }

    const result = await query(`
      INSERT INTO categories (name, description, color)
      VALUES (?, ?, ?)
    `, [name, description, color]);

    const category = await query('SELECT * FROM categories WHERE id = ?', [result.insertId]);

    ctx.body = {
      success: true,
      message: '分类创建成功',
      data: { category: category[0] }
    };
  } catch (error) {
    console.error('Create category error:', error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: '创建分类失败'
    };
  }
});

router.put('/categories/:id', authorize(['admin']), async (ctx) => {
  try {
    const categoryId = ctx.params.id;
    const { name, description, color } = ctx.request.body;

    const updateFields = [];
    const updateValues = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (color !== undefined) {
      updateFields.push('color = ?');
      updateValues.push(color);
    }

    if (updateFields.length === 0) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: '没有有效的更新字段'
      };
      return;
    }

    updateFields.push('updated_at = NOW()');
    updateValues.push(categoryId);

    await query(`UPDATE categories SET ${updateFields.join(', ')} WHERE id = ?`, updateValues);

    const category = await query('SELECT * FROM categories WHERE id = ?', [categoryId]);

    ctx.body = {
      success: true,
      message: '分类更新成功',
      data: { category: category[0] }
    };
  } catch (error) {
    console.error('Update category error:', error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: '更新分类失败'
    };
  }
});

router.delete('/categories/:id', authorize(['admin']), async (ctx) => {
  try {
    const categoryId = ctx.params.id;

    // 检查是否有文章使用此分类
    const articles = await query('SELECT COUNT(*) as count FROM articles WHERE category_id = ?', [categoryId]);
    if (articles[0].count > 0) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: '该分类下还有文章，无法删除'
      };
      return;
    }

    await query('DELETE FROM categories WHERE id = ?', [categoryId]);

    ctx.body = {
      success: true,
      message: '分类删除成功'
    };
  } catch (error) {
    console.error('Delete category error:', error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: '删除分类失败'
    };
  }
});

// 标签管理
router.get('/tags', TagController.getList);
router.post('/tags', authorize(['admin']), async (ctx) => {
  try {
    const { name, color } = ctx.request.body;

    if (!name) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: '标签名称不能为空'
      };
      return;
    }

    const result = await query(`
      INSERT INTO tags (name, color)
      VALUES (?, ?)
    `, [name, color]);

    const tag = await query('SELECT * FROM tags WHERE id = ?', [result.insertId]);

    ctx.body = {
      success: true,
      message: '标签创建成功',
      data: { tag: tag[0] }
    };
  } catch (error) {
    console.error('Create tag error:', error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: '创建标签失败'
    };
  }
});

router.put('/tags/:id', authorize(['admin']), async (ctx) => {
  try {
    const tagId = ctx.params.id;
    const { name, color } = ctx.request.body;

    const updateFields = [];
    const updateValues = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (color !== undefined) {
      updateFields.push('color = ?');
      updateValues.push(color);
    }

    if (updateFields.length === 0) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: '没有有效的更新字段'
      };
      return;
    }

    updateFields.push('updated_at = NOW()');
    updateValues.push(tagId);

    await query(`UPDATE tags SET ${updateFields.join(', ')} WHERE id = ?`, updateValues);

    const tag = await query('SELECT * FROM tags WHERE id = ?', [tagId]);

    ctx.body = {
      success: true,
      message: '标签更新成功',
      data: { tag: tag[0] }
    };
  } catch (error) {
    console.error('Update tag error:', error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: '更新标签失败'
    };
  }
});

router.delete('/tags/:id', authorize(['admin']), async (ctx) => {
  try {
    const tagId = ctx.params.id;

    // 删除标签和文章的关联
    await query('DELETE FROM article_tags WHERE tag_id = ?', [tagId]);
    
    // 删除标签
    await query('DELETE FROM tags WHERE id = ?', [tagId]);

    ctx.body = {
      success: true,
      message: '标签删除成功'
    };
  } catch (error) {
    console.error('Delete tag error:', error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: '删除标签失败'
    };
  }
});

module.exports = router;
