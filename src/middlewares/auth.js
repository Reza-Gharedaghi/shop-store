const jwt = require("jsonwebtoken");
const userModel = require("./../models/User");

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies["access-token"];

    if (token) {
      const accessTokenPayload = jwt.verify(token, process.env.JWT_SECRET);

      if (!accessTokenPayload) {
        req.flash("error", "توکن منقضی شده است! مجددا ورود کنید.");
        return res.redirect("/auth/login");
      }
      const user = await userModel.findOne(
        { _id: accessTokenPayload.userId },
        "-password"
      );

      if (!user) {
        req.flash("error", "کاربری با این توکن یافت نشد !");
        return res.redirect("/auth/register");
      }
      req.user = user;
      next();
    } else {
      req.flash("error", "برای دسترسی ابتدا ورود یا ثبت نام کنید !");
      return res.redirect("/main");
    }
  } catch (err) {
    next(err);
  }
};
