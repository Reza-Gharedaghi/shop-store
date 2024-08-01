const { isValidObjectId } = require("mongoose");
const userModel = require("./../../models/User");
const refreshTokenModel = require("./../../models/RefreshToken");
const banUserModel = require("./../../models/BanUsers");
const commentModel = require("./../../models/Comment");
const { successResponse } = require("../../utils/helpers");

exports.showAdminPanelView = (req, res) => {
  return res.render("admin/category");
};

exports.showUsersManageView = async (req, res, next) => {
  try {
    const allUsers = await userModel.find({}, "-password").lean();

    for (let i = 0; i < allUsers.length; i++) {
      let user = allUsers[i];
      user.listNumber = i;
      user.listNumber = user.listNumber + 1;
    }

    return res.render("admin/users", {
      allUsers,
    });
  } catch (err) {
    next(err);
  }
};

exports.userBan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const isValidUserId = isValidObjectId(id);

    if (!isValidUserId) {
      req.flash("error", "آیدی کاربر معتبر نمی باشد !");
      return res.redirect("back");
    }

    const admins = await userModel.find({ role: "ADMIN" }).lean();
    const mainAdmin = admins[0];

    if (id.toString() === mainAdmin._id.toString()) {
      req.flash("error", "شما نمی توانید ادمین اصلی را بن کنید !");
      return res.redirect("back");
    } else if (id.toString() === user._id.toString()) {
      req.flash("error", "شما نمیتوانید خود را بن کنید !");
      return res.redirect("back");
    }

    const userToBan = await userModel.findById(id);

    if (!userToBan) {
      req.flash("error", "کاربری با این آیدی یافت نشد !");
      return res.redirect("back");
    }

    if (
      userToBan.role === "ADMIN" &&
      id.toString() !== mainAdmin._id.toString() &&
      user._id.toString() !== mainAdmin._id.toString()
    ) {
      req.flash("error", "شما نمی توانید ادمین های دیگر را بن کنید !");
      return res.redirect("back");
    }

    await userModel.findOneAndDelete({ _id: userToBan._id });

    await refreshTokenModel.deleteMany({ user: userToBan._id });

    const banUser = new banUserModel({
      phone: userToBan.phone,
    });

    await banUser.save();

    req.flash("success", "کاربر با موفقیت بن شد.");
    return res.redirect("back");
  } catch (err) {
    next(err);
  }
};

exports.promoteToAdmin = async (req, res, next) => {
  try {
    const { user } = req;
    const { id } = req.params;

    const isValidUserId = isValidObjectId(id);

    if (!isValidUserId) {
      req.flash("error", "آیدی کاربر معتبر نمی باشد !");
      return res.redirect("back");
    }

    const admins = await userModel.find({ role: "ADMIN" }, "-password").lean();
    const mainAdmin = admins[0];

    if (user._id.toString() !== mainAdmin._id.toString()) {
      req.flash("error", "فقط ادمین اصلی می تواند ترفیع بدهد !");
      return res.redirect("back");
    }

    const userToPromote = await userModel.findById(id);

    if (!userToPromote) {
      req.flash("error", "کاربری با این آیدی یافت نشد !");
      return res.redirect("back");
    }

    await userModel.findOneAndUpdate(
      { _id: userToPromote._id },
      {
        $set: { role: "ADMIN" },
      }
    );

    req.flash("success", "کاربر با موفقیت ترفیع یافت.");
    return res.redirect("back");
  } catch (err) {
    next(err);
  }
};

exports.deposeToUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const isValidUserId = isValidObjectId(id);

    if (!isValidUserId) {
      req.flash("error", "آیدی کاربر معتبر نمی باشد !");
      return res.redirect("back");
    }

    const admins = await userModel.find({ role: "ADMIN" }, "-password").lean();
    const mainAdmin = admins[0];

    if (id.toString() === mainAdmin._id.toString()) {
      req.flash("error", "شما نمیتوانید ادمین اصلی را عزل کنید !");
      return res.redirect("back");
    } else if (id.toString() === user._id.toString()) {
      req.flash("error", "شما نمیتوانید خود را عزل کنید !");
      return res.redirect("back");
    }

    const userToDepose = await userModel.findById(id);

    if (!userToDepose) {
      req.flash("error", "کاربری با این آیدی یافت نشد !");
      return res.redirect("back");
    }

    if (
      userToDepose.role === "ADMIN" &&
      id.toString() !== mainAdmin._id.toString() &&
      user._id.toString() !== mainAdmin._id.toString()
    ) {
      req.flash("error", "شما نمی توانید ادمین های دیگر را عزل کنید !");
      return res.redirect("back");
    }

    await userModel.findOneAndUpdate(
      { _id: userToDepose._id },
      {
        $set: { role: "USER" },
      }
    );

    req.flash("success", "ادمین مورد نظر با موفقیت عزل شد. 👌");
    return res.redirect("back");
  } catch (err) {
    next(err);
  }
};

exports.searchUser = async (req, res, next) => {
  try {
    const { id } = req.body;

    const isValidUserId = isValidObjectId(id);

    if (!isValidUserId) {
      req.flash("error", "آیدی کاربر معتبر نمی باشد !");
      return res.redirect("back");
    }

    const user = await userModel.find({ _id: id }, "-password");

    if (!user.length) {
      req.flash("error", "کاربری با این آیدی یافت نشد !");
      return res.redirect("back");
    }

    return res.render("admin/users", {
      allUsers: user,
    });
  } catch (err) {
    next(err);
  }
};

exports.showCommentManageView = async (req, res, next) => {
  try {
    const allComments = await commentModel
      .find({})
      .populate("user", "username")
      .lean();
    return res.render("admin/comment", {
      allComments,
    });
  } catch (err) {
    next(err);
  }
};

exports.acceptComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const isValidCommentId = isValidObjectId(id);

    if (!isValidCommentId) {
      req.flash("error", "آیدی کامنت معتبر نمی باشد !");
      return res.redirect("back");
    }

    const commentToAccept = await commentModel.findById(id);

    if (!commentToAccept) {
      req.flash("error", "کامنتی با این آیدی یافت نشد !");
      return res.redirect("back");
    }

    await commentModel.findOneAndUpdate(
      { _id: commentToAccept._id },
      {
        $set: { isAccept: true, status: "تائید و ثبت شده" },
      }
    );

    req.flash("success", "کامنت مورد نظر با موفقیت تائید شد.");
    return res.redirect("back");
  } catch (err) {
    next(err);
  }
};

exports.rejectComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const isValidCommentId = isValidObjectId(id);

    if (!isValidCommentId) {
      req.flash("error", "آیدی کامنت معتبر نمی باشد !");
      return res.redirect("back");
    }

    const commentToReject = await commentModel.findById(id);

    if (!commentToReject) {
      req.flash("error", "کامنتی با این آیدی یافت نشد !");
      return res.redirect("back");
    }

    await commentModel.findOneAndUpdate(
      { _id: commentToReject._id },
      {
        $set: { status: "رد شده" },
      }
    );

    req.flash("success", "کامنت مورد نظر با موفقیت رد شد.");
    return res.redirect("back");
  } catch (err) {
    next(err);
  }
};

exports.searchComment = async (req, res, next) => {
  try {
    const { id } = req.body;

    const isValidCommentId = isValidObjectId(id);

    if (!isValidCommentId) {
      req.flash("error", "آیدی کامنت معتبر نمی باشد !");
      return res.redirect("back");
    }

    const isExistComment = await commentModel.find({ _id: id });

    if (!isExistComment.length) {
      req.flash("error", "کامنتی با این آیدی یافت نشد !");
      return res.redirect("back");
    }

    return res.render("admin/comment", {
      allComments: isExistComment,
    });
  } catch (err) {
    next(err);
  }
};
