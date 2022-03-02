const express = require("express");
const { session } = require("passport");
const { genPassword } = require("../lib/passwordUtil");
const UserModel = require("../models/user");
const router = express.Router();

module.exports = (app, passport) => {
  app.use("/auth", router);

  /**
   * @swagger
   * definitions:
   *  User:
   *    type: object
   *    properties:
   *      email:
   *        type: string
   *      password:
   *        type: string
   *      firstName:
   *        type: string
   *      lastName:
   *        type: string
   *  Credentials:
   *    type: object
   *    properties:
   *      email:
   *        type: string
   *      password:
   *        type: string
   *  ResponseObject:
   *    type: object
   *    properties:
   *      success:
   *        type: boolean
   *      status_code:
   *        type: integer
   *      status_message:
   *        type: string
   */

  /**
   * @swagger
   * /auth/register:
   *  post:
   *    tags:
   *      - Authorization
   *    description: Registers a new user
   *    produces:
   *      - application/json
   *    parameters:
   *      - name: user
   *        description: User object
   *        in: body
   *        required: true
   *        schema:
   *          $ref: '#/definitions/User'
   *    responses:
   *      201:
   *        description: Successfully created
   *        schema:
   *          $ref: "#/definitions/ResponseObject"
   *      404:
   *        description: Registration failed
   *        schema:
   *          $ref: "#/definitions/ResponseObject"
   */
  router.post("/register", async (req, res, next) => {
    const { email, password, firstName, lastName } = req.body;
    const saltHash = genPassword(password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new UserModel({
      email: email,
      hash,
      salt,
      firstName,
      lastName,
      admin: false,
      createdAt: new Date(),
      modifiedAt: new Date(),
    });

    newUser
      .save()
      .then((user) => {
        console.log(user);
        res.status(201).json({
          success: true,
          status_code: 201,
          status_message: "You are now registered. Please login.",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(404).json({
          success: false,
          status_code: 404,
          status_message:
            "Error registering. User may already exist. Please try again",
        });
      });
  });

  /**
   * @swagger
   * /auth/login:
   *  post:
   *    tags:
   *      - Authorization
   *    description: Logs user in
   *    produces:
   *      - application/json
   *    parameters:
   *      - name: credentials
   *        description: Credentials object
   *        in: body
   *        required: true
   *        schema:
   *          $ref: '#/definitions/Credentials'
   *    responses:
   *      200:
   *        description: Successfully logged in
   *        schema:
   *          $ref: "#/definitions/ResponseObject"
   *      404:
   *        description: Login failed
   *        schema:
   *          $ref: "#/definitions/ResponseObject"
   */
  router.post("/login", passport.authenticate("local"), (req, res, next) => {
    res.json({
      success: true,
      status_code: 200,
      status_message: "You are now logged in!",
    });
  });

  /**
   * @swagger
   * /auth/logout:
   *  get:
   *    tags:
   *      - Authorization
   *    description: Logs user out
   *    produces:
   *      - application/json
   *    responses:
   *      200:
   *        description: Successfully logged out
   *        schema:
   *          $ref: "#/definitions/ResponseObject"
   *      404:
   *        description: Logout failed
   *        schema:
   *          $ref: "#/definitions/ResponseObject"
   */
  router.get("/logout", (req, res, next) => {
    req.logout();
    res.json({
      success: true,
      status_code: 200,
      status_message: "You are now logged out!",
    });
  });
};
