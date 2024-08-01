const userModel = require("./../../models/User");
const banUsersModel = require("./../../models/BanUsers");
const refreshTokenModel = require("./../../models/RefreshToken");
const resetPasswordModel = require("./../../models/ResetPassword");
const {
  handleAccessToken,
  handleRefreshToken,
} = require("./../../utils/helpers");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

exports.showRegisterView = (req, res) => {
  return res.render("auth/register");
};

exports.register = async (req, res, next) => {
  try {
    const { username, phone, email, password, customCheck } = req.body;

    const isBannedUser = await banUsersModel.findOne({ phone });

    if (isBannedUser) {
      req.flash(
        "error",
        "شماره تلفن ارسالی قبلا مسدود شده است! امکان ثبت نام وجود ندارد."
      );
      return res.redirect("/main");
    }

    const isExistUser = await userModel.findOne({
      $or: [{ phone }, { email }],
    });

    if (isExistUser) {
      req.flash(
        "error",
        "کاربری با این ایمیل یا شماره تماس قبلا ثبت نام کرده !"
      );
      return res.redirect("back");
    }

    if (!customCheck) {
      req.flash(
        "error",
        "لطفا حریم خصوصی ، شرایط و قوانین را مطالعه و آن را تائید نمایید !"
      );
      return res.redirect("back");
    }

    const usersCount = await userModel.countDocuments();
    let role = null;
    if (usersCount < 1) {
      role = "ADMIN";
    } else {
      role = "USER";
    }

    const user = new userModel({
      username,
      phone,
      email,
      password,
      role,
    });

    await user.save();

    await handleRefreshToken(res, user);

    handleAccessToken(res, user);

    req.flash("success", "ثبت نام با موفقیت انجام شد ");
    return res.redirect("/main");
  } catch (err) {
    next(err);
  }
};

exports.showLoginView = (req, res) => {
  return res.render("auth/login");
};

exports.login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    const user = await userModel.findOne({ phone });

    if (!user) {
      req.flash("error", "کاربری با این شماره تماس یافت نشد !");
      return res.redirect("back");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      req.flash("error", "شماره تماس یا رمز عبور صحیح نمی باشد !");
      return res.redirect("back");
    }

    await refreshTokenModel.deleteMany({ user });

    const newRefreshToken = await refreshTokenModel.createToken(user);

    const newAccessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.cookie("refresh-token", newRefreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 2592000000,
    });

    res.cookie("access-token", newAccessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7200000,
    });

    req.flash("success", "ورود با موفقیت انجام شد");
    return res.redirect("/main");
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies["refresh-token"];

    if (refreshToken) {
      const payload = await refreshTokenModel.verifyToken(refreshToken);

      if (!payload) {
        req.flash("error", "توکن منقضی شده است. مجددا ورود کنید !");
        return res.redirect("/auth/login");
      }
      const user = await userModel.findOne({ _id: payload.user });

      if (!user) {
        req.flash("error", "کاربری با این توکن یافت نشد !");
        return res.redirect("/auth/register");
      }

      handleAccessToken(res, user);

      req.flash("success", "توکن جدید با موفقیت ساخته شد");
      return res.redirect("/main");
    } else {
      req.flash("error", "توکنی یافت نشد! مجددا ورود کنید");
      return res.redirect("/auth/login");
    }
  } catch (err) {
    next(err);
  }
};

exports.showForgetPasswordView = async (req, res) => {
  return res.render("auth/forgetPassword");
};

exports.forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      req.flash("error", "کاربری با این ایمیل یافت نشد !");
      return res.redirect("back");
    }

    const token = crypto.randomBytes(32).toString("hex");

    const expireTime = Date.now() + 1000 * 900;

    const resetPassDocument = new resetPasswordModel({
      token,
      user: user._id,
      expire: expireTime,
    });

    await resetPassDocument.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "rgharedaghi270@gmail.com",
        pass: "wkrs qchd fsfz jcsu",
      },
    });

    const mailOptions = {
      from: "rgharedaghi270@gmail.com",
      to: email,
      subject: `با سلام و احترام جناب آقای/خانم ${user.username}.`,
      html: `<h2> لینک بازیابی رمز عبور شما : </h2>
      <a href="http://localhost:${process.env.PORT}/auth/reset-password/${token}" >
      بازیابی رمز عبور
      </a>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        throw new Error(err);
      }
    });

    req.flash(
      "success",
      "ایمیل بازیابی رمز عبور برای شما ارسال شد. لطفا ایمیل خود را بررسی کنید."
    );
    return res.redirect("back");
  } catch (err) {
    next(err);
  }
};

exports.showResetPasswordView = async (req, res) => {
  return res.render("auth/resetPassword");
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const resetTokenDocument = await resetPasswordModel.findOne({
      token,
      expire: { $gt: Date.now() },
    });

    if (!resetTokenDocument) {
      req.flash("error", "و یا منقضی شده توکن دریافتی معتبر نمی باشد !");
      return res.redirect("back");
    }

    const user = await userModel.findOne({ _id: resetTokenDocument.user });

    if (!user) {
      req.flash("error", "کاربری با این توکن یافت نشد !");
      return res.redirect("back");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
      }
    );

    await resetPasswordModel.deleteMany({ user: user._id });

    req.flash("success", "رمز عبور شما با موفقیت تغییر کرد");
    return res.redirect("back");
  } catch (err) {
    next(err);
  }
};

exports.logOut = async (req, res, next) => {
  try {
    const { user } = req;
    res.clearCookie("access-token");
    res.clearCookie("refresh-token");

    await refreshTokenModel.deleteMany({ user: user._id });

    req.flash("success", "شما از حساب خود خارج شدید.");
    return res.redirect("/main");
  } catch (err) {
    next(err);
  }
};
