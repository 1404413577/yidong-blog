const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../../uploads');
const avatarDir = path.join(uploadDir, 'avatars');
const articleDir = path.join(uploadDir, 'articles');

// 创建上传目录
[uploadDir, avatarDir, articleDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 存储配置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = uploadDir;
    
    // 根据文件类型选择不同的存储路径
    if (req.uploadType === 'avatar') {
      uploadPath = avatarDir;
    } else if (req.uploadType === 'article') {
      uploadPath = articleDir;
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  // 检查文件类型
  const allowedTypes = {
    avatar: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    article: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  };

  const uploadType = req.uploadType || 'article';
  const allowed = allowedTypes[uploadType] || allowedTypes.article;

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`不支持的文件类型: ${file.mimetype}`), false);
  }
};

// 创建multer实例
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB限制
    files: 1 // 单次只能上传一个文件
  }
});

/**
 * 头像上传中间件
 */
const uploadAvatar = (ctx, next) => {
  ctx.req.uploadType = 'avatar';
  
  return new Promise((resolve, reject) => {
    upload.single('avatar')(ctx.req, ctx.res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            ctx.status = 400;
            ctx.body = {
              success: false,
              message: '文件大小不能超过5MB'
            };
          } else {
            ctx.status = 400;
            ctx.body = {
              success: false,
              message: `上传错误: ${err.message}`
            };
          }
        } else {
          ctx.status = 400;
          ctx.body = {
            success: false,
            message: err.message
          };
        }
        resolve();
      } else {
        resolve(next());
      }
    });
  });
};

/**
 * 文章图片上传中间件
 */
const uploadArticleImage = (ctx, next) => {
  ctx.req.uploadType = 'article';
  
  return new Promise((resolve, reject) => {
    upload.single('image')(ctx.req, ctx.res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            ctx.status = 400;
            ctx.body = {
              success: false,
              message: '文件大小不能超过5MB'
            };
          } else {
            ctx.status = 400;
            ctx.body = {
              success: false,
              message: `上传错误: ${err.message}`
            };
          }
        } else {
          ctx.status = 400;
          ctx.body = {
            success: false,
            message: err.message
          };
        }
        resolve();
      } else {
        resolve(next());
      }
    });
  });
};

/**
 * 多文件上传中间件
 */
const uploadMultiple = (fieldName, maxCount = 5) => {
  return (ctx, next) => {
    ctx.req.uploadType = 'article';
    
    return new Promise((resolve, reject) => {
      upload.array(fieldName, maxCount)(ctx.req, ctx.res, (err) => {
        if (err) {
          if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
              ctx.status = 400;
              ctx.body = {
                success: false,
                message: '文件大小不能超过5MB'
              };
            } else if (err.code === 'LIMIT_FILE_COUNT') {
              ctx.status = 400;
              ctx.body = {
                success: false,
                message: `最多只能上传${maxCount}个文件`
              };
            } else {
              ctx.status = 400;
              ctx.body = {
                success: false,
                message: `上传错误: ${err.message}`
              };
            }
          } else {
            ctx.status = 400;
            ctx.body = {
              success: false,
              message: err.message
            };
          }
          resolve();
        } else {
          resolve(next());
        }
      });
    });
  };
};

/**
 * 删除文件
 * @param {string} filePath - 文件路径
 */
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Delete file error:', error);
    return false;
  }
};

/**
 * 获取文件URL
 * @param {string} filename - 文件名
 * @param {string} type - 文件类型 (avatar/article)
 */
const getFileUrl = (filename, type = 'article') => {
  if (!filename) return null;
  return `/uploads/${type}s/${filename}`;
};

module.exports = {
  uploadAvatar,
  uploadArticleImage,
  uploadMultiple,
  deleteFile,
  getFileUrl,
  uploadDir,
  avatarDir,
  articleDir
};
