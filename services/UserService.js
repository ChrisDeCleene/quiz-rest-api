const { off } = require("../models/user");
const UserModel = require("../models/user");

module.exports = class UserService {
  async get(data) {
    const { id } = data;

    try {
      // Check if user already exists
      const user = await UserModel.findById(id);

      // If user doesn't exist, reject
      if (!user) {
        throw createError(404, "User record not found");
      }

      return user;
    } catch (err) {
      throw err;
    }
  }

  async update(userId, data) {
    try {
      const { email, password, firstName, lastName, createdAt, modifiedAt } =
        data;
      if (
        !email ||
        !password ||
        !firstName ||
        !lastName ||
        !createdAt ||
        !modifiedAt
      ) {
        throw new Error("Cannot update user. Missing required information.");
      }
      // Check if user already exists
      const user = await UserModel.findById(userId);
      if (!user) {
        throw createError(401, "User doesn't exist");
      }

      user.email = email;
      user.password = password;
      user.firstName = firstName;
      user.lastName = lastName;
      user.createdAt = createdAt;
      user.modifiedAt = modifiedAt;

      user.save()

      return user;
    } catch (err) {
      throw err;
    }
  }
};
