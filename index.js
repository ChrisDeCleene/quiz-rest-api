const mongoose = require("mongoose");
const createServer = require("./server");
const PORT = process.env.PORT || 5000;

const { MONGODB_CONNECTION_URL } = require("./config");

mongoose.connect(MONGODB_CONNECTION_URL, { useNewUrlParser: true }).then(async () => {
  const app = await createServer();
  app.listen(PORT, () => {
    console.log("Server has started! http://localhost:" + PORT);
  });
});
