const productsModel = require("./../../models/Product");
const favoritesModel = require("./../../models/Favorite");
const { isValidObjectId } = require("mongoose");

exports.showProductView = async (req, res) => {
  const { status } = req;
  const { id } = req.params;
  const isValidProductId = isValidObjectId(id);

  if (!isValidProductId) {
    req.flash("error", "آیدی محصول معتبر نمی باشد ! مجددا بررسی نمایید.");
    return res.redirect("back");
  }

  let product = await productsModel
    .findOne({ _id: id })
    .populate("category", "title")
    .populate("brand", "title");

  if (!product) {
    req.flash("error", " محصولی با این آیدی یافت نشد ! مجددا بررسی نمایید.");
    return res.redirect("back");
  }

  const favorite = await favoritesModel.findOne({ product: product._id });

  let isAddedToFavorite = null;
  if (favorite) {
    isAddedToFavorite = true;
  }

  return res.render("product/product", {
    product,
    status,
    isAddedToFavorite,
  });
};
