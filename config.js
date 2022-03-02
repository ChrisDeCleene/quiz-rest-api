const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  MONGODB_CONNECTION_URL: process.env.MONGODB_URL,
  MONGODB_TEST_URL: process.env.MONGODB_TEST_URL,
  SESSION_SECRET: process.env.SESSION_SECRET,
};
