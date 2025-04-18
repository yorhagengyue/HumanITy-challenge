const { authJwt } = require("../middleware");
const controller = require("../controllers/healthMetric.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept, x-access-token"
    );
    next();
  });

  // 创建新的健康指标
  app.post(
    "/api/health-metrics",
    [authJwt.verifyToken],
    controller.create
  );

  // 获取所有健康指标
  app.get(
    "/api/health-metrics",
    [authJwt.verifyToken],
    controller.findAll
  );

  // 按类型获取健康指标
  app.get(
    "/api/health-metrics/type/:type",
    [authJwt.verifyToken],
    controller.findByType
  );

  // 按日期范围获取健康指标
  app.get(
    "/api/health-metrics/date-range",
    [authJwt.verifyToken],
    controller.findByDateRange
  );

  // 获取单个健康指标
  app.get(
    "/api/health-metrics/:id",
    [authJwt.verifyToken],
    controller.findOne
  );

  // 更新健康指标
  app.put(
    "/api/health-metrics/:id",
    [authJwt.verifyToken],
    controller.update
  );

  // 删除健康指标
  app.delete(
    "/api/health-metrics/:id",
    [authJwt.verifyToken],
    controller.delete
  );

  // 获取健康指标统计信息
  app.get(
    "/api/health-metrics/stats/:type",
    [authJwt.verifyToken],
    controller.getStats
  );
}; 