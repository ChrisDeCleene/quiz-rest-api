const express = require("express");
const { isUser, isAuth } = require("../lib/authMiddleware");
const UserModel = require("../models/user");
const router = express.Router();
const scoresRouter = require("./score");

module.exports = (app) => {
  app.use("/api/user", router);

  /**
   * @swagger
   * definitions:
   *  UserInfo:
   *    type: object
   *    properties:
   *      id:
   *        type: string
   *      email:
   *        type: string
   *      firstName:
   *        type: string
   *      lastName:
   *        type: string
   */

  /**
   * @swagger
   * /api/user:
   *  get:
   *    tags:
   *      - User/Scores
   *    description: Returns user information
   *    produces:
   *      - application/json
   *    responses:
   *      200:
   *        description: Successfully logged out
   *        schema:
   *          type: object
   *          properties:
   *            user:
   *              $ref: "#/definitions/UserInfo"
   */
  router.get("/", isAuth, async (req, res, next) => {
    const user = await UserModel.findById(req.user.id, {
      email: 1,
      firstName: 1,
      lastName: 1,
    });
    res.json({ user });
  });

  router.put("/", isAuth, async (req, res, next) => {
    // Handler for changing email or creating new password
    // Handler for updating firstName or lastName
  });

  router.use("/scores", scoresRouter);
};
