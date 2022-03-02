module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res
      .status(401)
      .json({ message: "You are not authorized to view this page!" });
  }
};


// TODO Create isAdmin middleware for checking if user is an admin
module.exports.isAdmin = (req, res, next) => {
  if (req.user.admin) {
    next();
  } else {
    res.status(401).json({ message: "You are not authorized to view this page!" });
  }
};