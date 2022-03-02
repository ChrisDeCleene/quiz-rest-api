const express = require("express");
const router = express.Router();
const UserService = require("../services/UserService");
const UserServiceInstance = new UserService();

module.exports = (app) => {
  app.use("/api/user", router);

  router.get("/:userId", async (req, res, next) => {
    try {
      const response = await UserServiceInstance.get(req.params.userId);
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  router.put("/:userId", async (req, res, next) => {
    try {
      const response = await UserServiceInstance.update(
        req.params.userId,
        req.body
      );
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });
};
