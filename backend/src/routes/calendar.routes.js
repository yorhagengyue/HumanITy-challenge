const calendarController = require("../controllers/calendar.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Calendar events routes
  app.get(
    "/api/calendar/events",
    [authJwt.verifyToken],
    calendarController.getAllEvents
  );

  app.get(
    "/api/calendar/events/month/:year/:month",
    [authJwt.verifyToken],
    calendarController.getMonthEvents
  );

  app.get(
    "/api/calendar/events/:id",
    [authJwt.verifyToken],
    calendarController.getEvent
  );

  app.post(
    "/api/calendar/events",
    [authJwt.verifyToken],
    calendarController.createEvent
  );

  app.put(
    "/api/calendar/events/:id",
    [authJwt.verifyToken],
    calendarController.updateEvent
  );

  app.delete(
    "/api/calendar/events/:id",
    [authJwt.verifyToken],
    calendarController.deleteEvent
  );

  // Calendar categories routes
  app.get(
    "/api/calendar/categories",
    [authJwt.verifyToken],
    calendarController.getAllCategories
  );

  app.post(
    "/api/calendar/categories",
    [authJwt.verifyToken],
    calendarController.createCategory
  );

  app.put(
    "/api/calendar/categories/:id",
    [authJwt.verifyToken],
    calendarController.updateCategory
  );

  app.delete(
    "/api/calendar/categories/:id",
    [authJwt.verifyToken],
    calendarController.deleteCategory
  );
}; 