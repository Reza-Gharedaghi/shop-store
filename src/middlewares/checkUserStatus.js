const refreshTokenModel = require("./../models/RefreshToken");
const userModel = require("./../models/User");

module.exports.isLoginUser = (req, res, next) => {
  const token = req.cookies["access-token"];

  let status = null;
  if (token) {
    status = true;
    req.status = status;
    next();
  } else {
    status = false;
    req.status = status;
    next();
  }
};
