const { authJwt } = require('../middleware');
const controller = require('../controllers/user.controller');
const multer = require('multer');
const path = require('path');

// Configure storage for avatar uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/avatars/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter for image uploads
const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB limit
  },
  fileFilter: fileFilter
});

module.exports = (app) => {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // 获取所有用户（仅管理员）
  app.get(
    "/api/users",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.findAll
  );

  // 获取当前用户信息
  app.get(
    "/api/users/me",
    [authJwt.verifyToken],
    controller.getCurrentUser
  );

  // 获取通知设置
  app.get(
    "/api/users/me/notifications",
    [authJwt.verifyToken],
    controller.getNotificationSettings
  );

  // 更新通知设置
  app.put(
    "/api/users/me/notifications",
    [authJwt.verifyToken],
    controller.updateNotificationSettings
  );

  // 获取隐私设置
  app.get(
    "/api/users/me/privacy",
    [authJwt.verifyToken],
    controller.getPrivacySettings
  );

  // 更新隐私设置
  app.put(
    "/api/users/me/privacy",
    [authJwt.verifyToken],
    controller.updatePrivacySettings
  );

  // 获取指定用户信息（仅管理员或用户本人）
  app.get(
    "/api/users/:id",
    [authJwt.verifyToken, authJwt.isAdminOrSameUser],
    controller.findOne
  );

  // 更新指定用户信息（仅管理员或用户本人）
  app.put(
    "/api/users/:id",
    [authJwt.verifyToken, authJwt.isAdminOrSameUser],
    controller.update
  );

  // 上传用户头像（仅管理员或用户本人）
  app.post(
    "/api/users/:id/avatar",
    [authJwt.verifyToken, authJwt.isAdminOrSameUser, upload.single('avatar')],
    controller.uploadAvatar
  );

  // 删除指定用户（仅管理员或用户本人）
  app.delete(
    "/api/users/:id",
    [authJwt.verifyToken, authJwt.isAdminOrSameUser],
    controller.delete
  );
}; 