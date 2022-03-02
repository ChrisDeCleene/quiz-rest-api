const createError = require("http-errors");

const UserModel = require("../models/user");

module.exports = class AuthService {
  constructor({ email, password, firstName, lastName, createdAt }) {
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.createdAt = createdAt || new Date();
    this.modifiedAt = new Date();
  }
  async register() {
    try {
      const newUser = new UserModel({
        email: this.email,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
        createdAt: this.createdAt,
      });
      newUser.save().then((user) => {
        console.log("Callback", user);
        res.redirect("/api/topics")
      });
    } catch (err) {
      throw createError(500, err);
    }
  }
  static async login(data) {
    const { email, password } = data;

    try {
      // Check if user exists
      const user = await UserModel.findOne({ email: email });

      // If no user found, reject
      if (!user) {
        throw createError(401, "Incorrect username or password");
      }

      // Check for matching passwords
      if (user.password !== password) {
        throw createError(401, "Incorrect username or password");
      }

      delete user.password;
      return user;
    } catch (err) {
      throw createError(500, err);
    }
  }
  static async deleteById(userId) {
    const deletedUser = await UserModel.deleteOne({ _id: userId });
    console.log(deletedUser);
    return deletedUser;
  }
};
