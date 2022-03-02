const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { SESSION_SECRET, MONGODB_CONNECTION_URL } = require("../config");

module.exports = (app) => {
  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // Transforms raw string of req.body into JSON
  app.use(bodyParser.json());

  // Parses urlencoded bodies
  app.use(bodyParser.urlencoded({ extended: true }));

  // Request loggin
  app.use(morgan("dev"));

  app.set("trust proxy", 1); // trust first proxy

  const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  const sessionStore = MongoStore.create({
    mongoUrl: MONGODB_CONNECTION_URL,
    mongoOptions: dbOptions,
    collectionName: "sessions",
  });

  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      store: sessionStore,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // Equals 1 day
      },
    })
  );

  return app;
};
