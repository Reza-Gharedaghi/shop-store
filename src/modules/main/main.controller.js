const productsModel = require("./../../models/Product");
const favoritesModel = require("./../../models/Favorite");
const contactUsModel = require("./../../models/ContactUs");

exports.showMainPageView = async (req, res) => {
  try {
    const { status } = req;

    const products = await productsModel.find({}).limit(5).lean();
    const favorites = await favoritesModel.find({}).lean();

    products.forEach((product) => {
      if (favorites.length) {
        favorites.forEach((favorite) => {
          if (product._id.toString() === favorite.product.toString()) {
            product.isAddedToFavorite = true;
          }
        });
      }
    });

    return res.render("index", {
      status,
      products,
    });
  } catch (err) {
    next(err);
  }
};

exports.showContactUsView = (req, res) => {
  const { status } = req;
  return res.render("contact", {
    status,
  });
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { title, username, email, phone, text } = req.body;

    const contact = new contactUsModel({
      title,
      username,
      email,
      phone,
      text,
    });

    await contact.save();

    req.flash(
      "success",
      "پیغام شما با موفقیت ثبت و ارسال شد. لطفا منتظر تماس ما باشید !"
    );
    return res.redirect("/main");
  } catch (err) {
    next(err);
  }
};
