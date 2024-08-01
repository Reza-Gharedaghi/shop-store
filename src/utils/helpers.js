const jwt = require("jsonwebtoken");
const refreshTokenModel = require("./../models/RefreshToken");

const handleAccessToken = (res, user) => {
  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });

  res.cookie("access-token", accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: 7200000,
  });
};

const handleRefreshToken = async (res, user) => {
  const refreshToken = await refreshTokenModel.createToken(user);

  res.cookie("refresh-token", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 2592000000,
  });
};

module.exports = {
  handleAccessToken,
  handleRefreshToken,
};
