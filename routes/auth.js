const express = require("express");
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
      admin: true,
      createdAt: new Date(),
      modifiedAt: new Date(),
    });

    newUser
      .save()
      .then((user) => {
        console.log(user);
        res.status(201).send("You are now registered. Please login.");
      })
      .catch((err) => {
        console.log(err);
      });
  });

  router.post(
    "/login",
    passport.authenticate("local", {
      failureRedirect: "/auth/login-failure",
      successRedirect: "/auth/login-success",
    })
  );

  // Visiting this route logs the user out
  router.get("/logout", (req, res, next) => {
    req.logout();
    res.send("You are now logged out!");
  });

  router.get("/login-success", (req, res, next) => {
    res.send("You are logged in!");
  });

  router.get("/login-failure", (req, res, next) => {
    res.send("You entered the wrong password.");
  });
};
