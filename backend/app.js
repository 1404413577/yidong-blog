const Koa = require('koa');
const cors = require('koa-cors');
const bodyParser = require('koa-bodyparser');
const json = require('koa-json');
const logger = require('koa-logger');
const serve = require('koa-static');
const mount = require('koa-mount');
const path = require('path');
const { testConnection } = require('./src/config/database');
const errorHandler = require('./src/middleware/errorHandler');
const router = require('./src/routes');
const authRoutes = require('./src/routes/auth');
const adminRoutes = require('./src/routes/admin');

require('dotenv').config();

const app = new Koa();

// 全局错误处理
app.use(errorHandler);

// 中间件
app.use(logger());
app.use(json());
app.use(bodyParser({
  enableTypes: ['json', 'form', 'text'],
  jsonLimit: '10mb',
  formLimit: '10mb',
  textLimit: '10mb'
}));

// CORS配置
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// 静态文件服务 - 用于提供上传的文件
app.use(mount('/uploads', serve(path.join(__dirname, 'uploads'))));

// 路由
app.use(authRoutes.routes()).use(authRoutes.allowedMethods());
app.use(adminRoutes.routes()).use(adminRoutes.allowedMethods());
app.use(router.routes()).use(router.allowedMethods());

// 应用级别错误监听
app.on('error', (err, ctx) => {
  console.error('应用错误:', err);
});

// 启动服务器
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // 测试数据库连接
    await testConnection();
    
    // 启动服务器
    app.listen(PORT, () => {
      console.log(`🚀 服务器启动成功`);
      console.log(`📍 服务地址: http://localhost:${PORT}`);
      console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 API文档: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
