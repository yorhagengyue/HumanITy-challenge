const { authJwt } = require('../middleware');
const controller = require('../controllers/task.controller');

module.exports = (app) => {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // 创建新任务
  app.post(
    "/api/tasks",
    [authJwt.verifyToken],
    controller.create
  );

  // 获取所有任务
  app.get(
    "/api/tasks",
    [authJwt.verifyToken],
    controller.findAll
  );

  // 获取任务统计
  app.get(
    "/api/tasks/stats",
    [authJwt.verifyToken],
    controller.getStats
  );

  // 获取单个任务
  app.get(
    "/api/tasks/:id",
    [authJwt.verifyToken],
    controller.findOne
  );

  // 更新任务
  app.put(
    "/api/tasks/:id",
    [authJwt.verifyToken],
    controller.update
  );

  // 删除任务
  app.delete(
    "/api/tasks/:id",
    [authJwt.verifyToken],
    controller.delete
  );
}; 