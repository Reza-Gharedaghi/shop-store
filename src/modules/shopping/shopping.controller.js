const shoppingCartModel = require("./../../models/ShoppingCart");
const productModel = require("./../../models/Product");
const { isValidObjectId } = require("mongoose");

exports.showShoppingCartView = async (req, res, next) => {
  try {
    const { status, user } = req;

    const cartProducts = await shoppingCartModel
      .find({ user: user._id })
      .populate("product")
      .lean();

    let finalScore = 0;
    let priceOfAll = 0;
    cartProducts.forEach((cartProduct) => {
      let productScore = cartProduct.product.score;
      let price = cartProduct.finalPrice;
      price = Number(price.split(" ")[0].replace(/,/g, ""));
      priceOfAll += price;

      productScore = productScore * cartProduct.count;
      finalScore += productScore;
    });

    priceOfAll = priceOfAll.toLocaleString("en-Us");

    return res.render("shopping/shoppingCart", {
      user,
      status,
      cartProducts,
      priceOfAll,
      finalScore,
    });
  } catch (err) {
    next(err);
  }
};

exports.addProductToCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const isValidProductId = isValidObjectId(id);

    if (!isValidProductId) {
      req.flash("error", "آیدی محصول معتبر نمی باشد ! مجددا بررسی نمایید.");
      return res.redirect("back");
    }

    const isExistProduct = await productModel.findOne({ _id: id });

    if (!isExistProduct) {
      req.flash("error", "محصولی با این آیدی یافت نشد ! مجددا بررسی نمایید.");
      return res.redirect("back");
    }

    const isExistCartProduct = await shoppingCartModel.findOne({
      $and: [{ product: isExistProduct._id }, { user: user._id }],
    });

    if (isExistCartProduct) {
      req.flash("error", "شما قبلا این محصول را به سبد خرید خود اضافه کردید !");
      return res.redirect("back");
    }

    if (!isExistCartProduct && isExistProduct.count === 0) {
      req.flash("error", "این محصول در حال حاضر ناموجود می باشد!");
      return res.redirect("back");
    }

    const cartProduct = new shoppingCartModel({
      product: isExistProduct._id,
      user: user._id,
      finalPrice: isExistProduct.price,
    });

    await cartProduct.save();

    await productModel.updateOne(
      { _id: isExistProduct._id },
      {
        $inc: { count: -1 },
      }
    );

    req.flash("success", "محصول مورد نظر با موفقیت به سبد خرید اضافه شد.");
    return res.redirect("back");
  } catch (err) {
    next(err);
  }
};

exports.removeProductFromCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isValidProductId = isValidObjectId(id);

    if (!isValidProductId) {
      req.flash("error", "آیدی محصول معتبر نمی باشد ! مجددا بررسی نمایید.");
      return res.redirect("back");
    }

    const cartProduct = await shoppingCartModel.findOne({ _id: id });

    const product = await productModel.findOne({ _id: cartProduct.product });

    await productModel.updateOne(
      { _id: product._id },
      {
        $inc: { count: cartProduct.count },
      }
    );

    const deletedCartProduct = await shoppingCartModel.deleteOne({
      _id: cartProduct._id,
    });

    if (!deletedCartProduct) {
      req.flash("error", "محصول جهت حذف یافت نشد ! مجددا بررسی نمایید.");
      return res.redirect("back");
    }

    req.flash("success", "محصول مورد نظر با موفقیت از سبد خرید حذف شد.");
    return res.redirect("back");
  } catch (err) {
    next(err);
  }
};

exports.increaseProductCount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isValidCartProductId = isValidObjectId(id);

    if (!isValidCartProductId) {
      req.flash("error", "آیدی محصول معتبر نمی باشد ! مجددا بررسی نمایید.");
      return res.redirect("back");
    }

    const isExistCartProduct = await shoppingCartModel.findOne({ _id: id });

    if (!isExistCartProduct) {
      req.flash("error", "محصولی با این آیدی یافت نشد ! مجددا بررسی نمایید.");
      return res.redirect("back");
    }

    const product = await productModel.findOne({
      _id: isExistCartProduct.product,
    });

    let { price } = product;

    if (product.count < 1) {
      await productModel.updateOne(
        { _id: product._id },
        { $set: { status: "ناموجود در انبار" } }
      );
      req.flash("error", "موجودی محصول در انبار اتمام یافت!");
      return res.redirect("back");
    }

    const updatedCartProduct = await shoppingCartModel.findOneAndUpdate(
      { _id: isExistCartProduct._id },
      {
        $inc: { count: 1 },
      },
      { new: true }
    );

    price = price.split(" ")[0].replace(/,/g, "");
    price = Number(price) * updatedCartProduct.count;
    price = price.toLocaleString("en-US");

    await shoppingCartModel.updateOne(
      { _id: isExistCartProduct._id },
      {
        $set: { finalPrice: `${price} تومان` },
      }
    );

    await productModel.updateOne(
      { _id: product._id },
      {
        $inc: { count: -1 },
      }
    );

    return res.redirect("back");
  } catch (err) {
    next(err);
  }
};

exports.decreaseProductCount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isValidCartProductId = isValidObjectId(id);

    if (!isValidCartProductId) {
      req.flash("error", "آیدی محصول معتبر نمی باشد ! مجددا بررسی نمایید.");
      return res.redirect("back");
    }

    const isExistCartProduct = await shoppingCartModel.findOne({ _id: id });

    if (!isExistCartProduct) {
      req.flash("error", "محصولی با این آیدی یافت نشد ! مجددا بررسی نمایید.");
      return res.redirect("back");
    }

    const product = await productModel.findOne({
      _id: isExistCartProduct.product,
    });

    let { price } = product;

    if (isExistCartProduct.count === 1) {
      req.flash("error", "صرفا جهت اطلاع: حداقل تعداد محصول 1 عدد می باشد");
      return res.redirect("back");
    }

    if (product.count >= 1) {
      await productModel.updateOne(
        { _id: product._id },
        {
          $set: { status: "موجود در انبار" },
        }
      );
    }

    const updatedCartProduct = await shoppingCartModel.findOneAndUpdate(
      { _id: isExistCartProduct._id },
      {
        $inc: { count: -1 },
      },
      {
        new: true,
      }
    );

    price = price.split(" ")[0].replace(/,/g, "");
    price = Number(price) * updatedCartProduct.count;
    price = price.toLocaleString("en-US");

    await shoppingCartModel.updateOne(
      { _id: isExistCartProduct._id },
      {
        $set: { finalPrice: `${price} تومان` },
      }
    );

    await productModel.updateOne(
      { _id: product._id },
      {
        $inc: { count: 1 },
      }
    );

    return res.redirect("back");
  } catch (err) {
    next(err);
  }
};
