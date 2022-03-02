const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

module.exports = (app) => {
  const swaggerDefinition = {
    info: {
      title: "CB-Code Quiz REST API",
      version: "1.0.0",
      description:
        "An API for creating and interacting with questions and topics.",
    },
    host: "localhost:5000",
    basePath: "/",
  };

  // options for the swagger docs
  var options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ["./routes/*.js"],
  };

  // Initialize swagger-jsdoc -> returns validated swagger spec in json format
  const swaggerSpec = swaggerJSDoc(options);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
