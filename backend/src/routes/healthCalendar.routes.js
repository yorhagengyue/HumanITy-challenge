const { authJwt } = require("../middlewares");
const controller = require("../controllers/healthCalendar.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  // 创建新的健康日历事件
  app.post(
    "/api/health-calendar",
    [authJwt.verifyToken],
    controller.createEvent
  );

  // 获取所有健康日历事件
  app.get(
    "/api/health-calendar",
    [authJwt.verifyToken],
    controller.getAllEvents
  );

  // 按月获取健康日历事件
  app.get(
    "/api/health-calendar/month/:year/:month",
    [authJwt.verifyToken],
    controller.getEventsByMonth
  );

  // 获取单个健康日历事件
  app.get(
    "/api/health-calendar/:id",
    [authJwt.verifyToken],
    controller.getEventById
  );

  // 更新健康日历事件
  app.put(
    "/api/health-calendar/:id",
    [authJwt.verifyToken],
    controller.updateEvent
  );

  // 删除健康日历事件
  app.delete(
    "/api/health-calendar/:id",
    [authJwt.verifyToken],
    controller.deleteEvent
  );

  // 获取与特定健康指标相关的事件
  app.get(
    "/api/health-calendar/metric/:metricId",
    [authJwt.verifyToken],
    controller.getEventsByMetric
  );

  // 按类别获取事件
  app.get(
    "/api/health-calendar/category/:category",
    [authJwt.verifyToken],
    controller.getEventsByCategory
  );
}; 