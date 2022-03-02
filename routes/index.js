const authRouter = require("./auth");
const userRouter = require("./user");
const questionRouter = require("./question");
const topicRouter = require("./topic");

module.exports = (app, passport) => {
  authRouter(app, passport);
  userRouter(app);
  questionRouter(app);
  topicRouter(app);
};
