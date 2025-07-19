const Router = require('koa-router');
const AuthController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { uploadAvatar, getFileUrl } = require('../middleware/upload');
const User = require('../models/User');

const router = new Router({
  prefix: '/api/auth'
});

// 用户注册
router.post('/register', AuthController.register);

// 用户登录
router.post('/login', AuthController.login);

// 用户登出
router.post('/logout', authenticate, AuthController.logout);

// 获取当前用户信息
router.get('/me', authenticate, AuthController.getCurrentUser);

// 更新用户信息
router.put('/profile', authenticate, AuthController.updateProfile);

// 修改密码
router.put('/password', authenticate, AuthController.changePassword);

// 上传头像
router.post('/avatar', authenticate, uploadAvatar, async (ctx) => {
  try {
    if (!ctx.req.file) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: '请选择要上传的头像文件'
      };
      return;
    }

    const filename = ctx.req.file.filename;
    const avatarUrl = getFileUrl(filename, 'avatar');
    
    // 更新用户头像
    await User.update(ctx.user.id, { avatar: avatarUrl });

    ctx.body = {
      success: true,
      message: '头像上传成功',
      data: {
        avatar: avatarUrl
      }
    };
  } catch (error) {
    console.error('Upload avatar error:', error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: '头像上传失败'
    };
  }
});

// 验证token有效性
router.get('/verify', authenticate, async (ctx) => {
  ctx.body = {
    success: true,
    message: 'Token有效',
    data: {
      user: {
        id: ctx.user.id,
        username: ctx.user.username,
        email: ctx.user.email,
        nickname: ctx.user.nickname,
        avatar: ctx.user.avatar,
        role: ctx.user.role
      }
    }
  };
});

module.exports = router;
