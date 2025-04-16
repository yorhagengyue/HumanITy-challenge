const controller = require('../controllers/auth.controller');

module.exports = (app) => {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // 用户注册
  app.post(
    "/api/auth/signup",
    controller.signup
  );
  
  // 用户注册 (别名 - 兼容前端调用)
  app.post(
    "/api/auth/register",
    controller.signup
  );

  // 用户登录
  app.post(
    "/api/auth/signin",
    controller.signin
  );
  
  // 用户登录 (别名 - 兼容前端调用)
  app.post(
    "/api/auth/login",
    controller.signin
  );

  // 验证令牌
  app.post(
    "/api/auth/verify-token",
    controller.verifyToken
  );
}; 