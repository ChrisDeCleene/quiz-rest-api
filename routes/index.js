const authRouter = require("./auth");
const userRouter = require("./user");
const questionRouter = require("./question");
const topicRouter = require("./topic");

module.exports = (app, passport) => {
  app.get("/", (req, res, next) => {
    res.redirect("/api-docs");
  });
  authRouter(app, passport);
  userRouter(app);
  questionRouter(app);
  topicRouter(app);
};
