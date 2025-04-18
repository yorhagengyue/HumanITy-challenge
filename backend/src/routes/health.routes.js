const healthController = require('../controllers/health.controller');
const { authJwt } = require('../middleware');

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // GET routes
  app.get(
    "/api/health/summary", 
    [authJwt.verifyToken], 
    healthController.getSummary
  );
  
  app.get(
    "/api/health",
    [authJwt.verifyToken],
    healthController.findAll
  );
  
  app.get(
    "/api/health/type/:type",
    [authJwt.verifyToken],
    healthController.findByType
  );
  
  app.get(
    "/api/health/:id",
    [authJwt.verifyToken],
    healthController.findOne
  );

  // 添加获取健康日历事件的API
  app.get(
    "/api/health/calendar/events",
    [authJwt.verifyToken],
    healthController.getCalendarEvents
  );

  app.get(
    "/api/health/calendar/events/month/:year/:month",
    [authJwt.verifyToken],
    healthController.getMonthCalendarEvents
  );

  // POST route
  app.post(
    "/api/health",
    [authJwt.verifyToken],
    healthController.create
  );

  // PUT route
  app.put(
    "/api/health/:id",
    [authJwt.verifyToken],
    healthController.update
  );

  // DELETE route
  app.delete(
    "/api/health/:id",
    [authJwt.verifyToken],
    healthController.delete
  );
};