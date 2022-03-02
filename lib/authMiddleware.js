module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res
      .status(401)
      .json({
        success: false,
        status_code: 401,
        status_message: "You are not authorized to access this route!",
      });
  }
};

// Limits document access to the active user only
module.exports.isUser = (req, res, next) => {
  if (req.isAuthenticated() && req.user.id === req.params.userId) {
    next();
  } else {
    res
      .status(401)
      .json({
        success: false,
        status_code: 401,
        status_message: "You are not authorized to access this route!",
      });
  }
};

// Middleware for checking if user is an admin
module.exports.isAdmin = (req, res, next) => {
  if (req.user.admin) {
    next();
  } else {
    res
      .status(401)
      .json({
        success: false,
        status_code: 401,
        status_message: "You are not authorized to access this route!",
      });
  }
};
