const expressLoader = require("./express");
const passportLoader = require("./passport");
const routesLoader = require("../routes");
const swaggerLoader = require("./swagger");
const errorhandler = require("errorhandler");

module.exports = async (app) => {

  const expressApp = await expressLoader(app);

  const passport = passportLoader(expressApp);

  routesLoader(app, passport);

  swaggerLoader(app);

  app.use(errorhandler);
};
