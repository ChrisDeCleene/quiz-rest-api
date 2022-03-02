const express = require("express");
const { session } = require("passport");
const { genPassword } = require("../lib/passwordUtil");
const UserModel = require("../models/user");
const router = express.Router();

module.exports = (app, passport) => {
  app.use("/auth", router);

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

  router.post(
    "/login",
    passport.authenticate("local"),
    // passport.authenticate("local", {
    //   failureRedirect: "/auth/login-failure",
    //   successRedirect: "/auth/login-success",
    // }),
    (req, res, next) => {
      res.json({
        userId: req.user.id,
        success: true,
        status_message: "You are now logged in!",
      });
    }
  );

  // Visiting this route logs the user out
  router.get("/logout", (req, res, next) => {
    req.logout();
    res.json({ success: true, status_message: "You are now logged out!" });
  });

  router.get("/login-success", (req, res, next) => {
    console.log(req.session);
    res.json({
      success: true,
      // TODO: Send some sort of token or session id back!! @ChrisDeCleene
      status_message: "You are logged in!",
    });
  });

  router.get("/login-failure", (req, res, next) => {
    res.status(404).json({
      status_code: 404,
      status_message: "You entered the wrong password.",
    });
  });
};
