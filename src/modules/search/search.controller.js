const productModel = require("./../../models/Product");
const favoritesModel = require("./../../models/Favorite");

exports.showSearchPageView = async (req, res, next) => {
  try {
    const { status } = req;

    const allProducts = await productModel.find({}).lean();
    const favorites = await favoritesModel.find({}).lean();

    allProducts.forEach((product) => {
      if (favorites.length) {
        favorites.forEach((favorite) => {
          if (product._id.toString() === favorite.product.toString()) {
            product.isAddedToFavorite = true;
          }
        });
      }
    });

    return res.render("search/search", {
      status,
      allProducts,
    });
  } catch (err) {
    next(err);
  }
};

exports.searchProduct = async (req, res, next) => {
  try {
    const { status } = req;
    const { productInfo } = req.body;

    const demandProducts = await productModel
      .find({ title: { $regex: ".*" + productInfo + ".*" } })
      .lean();

    const favorites = await favoritesModel.find({}).lean();

    demandProducts.forEach((product) => {
      if (favorites.length) {
        favorites.forEach((favorite) => {
          if (product._id.toString() === favorite.product.toString()) {
            product.isAddedToFavorite = true;
          }
        });
      }
    });

    return res.render("search/search", {
      allProducts: demandProducts,
      status,
    });
  } catch (err) {
    next(err);
  }
};
