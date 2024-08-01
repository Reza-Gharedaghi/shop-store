const userModel = require("./../../models/User");
const favoritesModel = require("./../../models/Favorite");
const productsModel = require("./../../models/Product");
const addressModel = require("./../../models/Address");
const commentsModel = require("./../../models/Comment");
const bcrypt = require("bcryptjs");
const { isValidObjectId } = require("mongoose");

exports.showUserProfileView = async (req, res, next) => {
  const { user, status } = req;

  const favorites = await favoritesModel
    .find({ user: user._id })
    .populate("product", "title")
    .lean();

  return res.render("user/profile", {
    user,
    status,
    favorites,
  });
};

exports.showEditProfileView = (req, res) => {
  const { status, user } = req;

  return res.render("user/editProfile", {
    user,
    status,
  });
};

exports.editUserInfos = async (req, res, next) => {
  try {
    const { username, phone, email, nationalCode, getNews, cardNumber } =
      req.body;

    const { user } = req;

    const isExistUser = await userModel.findOne({
      $or: [{ email }, { phone }],
    });

    if (
      isExistUser &&
      (isExistUser.email !== user.email || isExistUser.phone !== user.phone)
    ) {
      req.flash("error", "این ایمیل یا شماره موبایل قبلا استفاده شده است !");
      return res.redirect("back");
    }

    await userModel.updateOne(
      { _id: user._id },
      {
        username,
        email,
        phone,
        nationalCode,
        getNews,
        cardNumber,
      }
    );

    req.flash("success", "اطلاعات شما با موفقیت آپدیت شد.");
    return res.redirect("/user/profile");
  } catch (err) {
    next(err);
  }
};

exports.showChangePasswordView = async (req, res, next) => {
  return res.render("user/changePassword");
};

exports.changePassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { user } = req;

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.findOneAndUpdate(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
      }
    );

    req.flash("success", "رمز عبور شما با موفقیت آپدیت شد.");
    return res.redirect("/user/profile");
  } catch (err) {
    next(err);
  }
};

exports.showFavoritesPageView = async (req, res, next) => {
  try {
    const { user, status } = req;

    const userFavorites = await favoritesModel
      .find({ user: user._id })
      .populate("product", "title")
      .lean();

    return res.render("user/favorites", {
      userFavorites,
      user,
      status,
    });
  } catch (err) {
    next(err);
  }
};

exports.addToFavorites = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const isValidProductId = isValidObjectId(id);

    if (!isValidProductId) {
      req.flash("error", "آیدی محصول مورد نظر معتبر نمی باشد !");
      return res.redirect("back");
    }

    const isExistProduct = await productsModel.findOne({ _id: id });

    if (!isExistProduct) {
      req.flash("error", "محصول مورد نظر یافت نشد !");
      return res.redirect("back");
    }

    const favorite = new favoritesModel({
      product: id,
      user: user._id,
    });

    await favorite.save();

    req.flash("success", "محصول مورد نظر با موفقیت به علاقه مندی ها اضافه شد.");
    return res.redirect("back");
  } catch (err) {
    next(err);
  }
};

exports.removeFromFavorites = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isValidProductId = isValidObjectId(id);

    if (!isValidProductId) {
      req.flash("error", "آیدی محصول مورد نظر معتبر نمی باشد !");
      return res.redirect("back");
    }

    const isExistProduct = await productsModel.findOne({ _id: id });

    if (!isExistProduct) {
      req.flash("error", "محصول مورد نظر یافت نشد !");
      return res.redirect("back");
    }

    await favoritesModel.findOneAndDelete({ product: id });

    req.flash("success", "محصول مورد نظر با موفقیت از علاقه مندی ها حذف شد.");
    return res.redirect("back");
  } catch (err) {
    next(err);
  }
};

exports.showUserAddressView = async (req, res, next) => {
  try {
    let states = [
      "تهران",
      "گیلان",
      "مازندران",
      "آذربایجان شرقی",
      "آذربایجان غربی",
      "کرمانشاه",
      "خوزستان",
      "فارس",
      "کرمان",
      "خراسان",
      "اصفهان",
      "البرز",
      "سیستان و بلوچستان",
      "هرمزگان",
      "یزد",
      "قم",
      "مرکزی",
      "سمنان",
      "زنجان",
      "همدان",
      "لرستان",
      "ایلام",
      "بوشهر",
      "چهارمحال و بختیاری",
      "کهگیلویه و بویراحمد",
      "خراسان رضوی",
      "خراسان شمالی",
      "خراسان جنوبی",
      "اردبیل",
      "قزوین",
    ];

    let cities = [
      "تهران",
      "اصفهان",
      "اهواز",
      "قم",
      "مشهد",
      "کرج",
      "شیراز",
      "تبریز",
      "رشت",
      "همدان",
      "یزد",
      "کرمان",
      "بندر عباس",
      "زنجان",
      "ساری",
      "بوشهر",
      "اراک",
      "اردبیل",
      "قزوین",
      "زاهدان",
    ];

    const { status, user } = req;

    const addresses = await addressModel.find({ user: user._id }).lean();

    return res.render("user/address", {
      status,
      user,
      states,
      cities,
      addresses,
    });
  } catch (err) {
    next(err);
  }
};

exports.userAddressRegister = async (req, res, next) => {
  try {
    const { user } = req;
    const { username, phone, postCode, state, city, completeAddress } =
      req.body;

    const isExistAddress = await addressModel.findOne({
      $or: [{ postCode }, { completeAddress }],
    });

    if (isExistAddress) {
      req.flash("error", "شما قبلا این آدرس را ثبت کرده اید !");
      return res.redirect("back");
    }

    await addressModel.create({
      username,
      phone,
      user: user._id,
      state,
      city,
      postCode,
      completeAddress,
    });

    req.flash("success", "آدرس شما با موفقیت ثبت شد.");
    return res.redirect("back");
  } catch (err) {
    next(err);
  }
};

exports.removeAddress = async (req, res, next) => {
  try {
    const { id } = req.params;

    const isValidAddressId = isValidObjectId(id);

    if (!isValidAddressId) {
      req.flash("error", "آیدی آدرس مورد نظر معتبر نمی باشد !");
      return res.redirect("back");
    }

    const isExistAddress = await addressModel.findOne({ _id: id });

    if (!isExistAddress) {
      req.flash("error", "آدرس مورد نظر یافت نشد !");
      return res.redirect("back");
    }

    await addressModel.deleteOne({ _id: id });

    req.flash("success", "آدرس مورد نظر با موفقیت حذف شد.");
    return res.redirect("back");
  } catch (err) {
    next(err);
  }
};

exports.showUserCommentsView = async (req, res, next) => {
  try {
    const { user, status } = req;

    const userComments = await commentsModel
      .find({ user: user._id })
      .populate("product")
      .lean();

    return res.render("user/comments", {
      status,
      userComments,
      user,
    });
  } catch (err) {
    next(err);
  }
};
