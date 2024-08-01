const { isValidObjectId } = require("mongoose");
const commentModel = require("./../../models/Comment");
const productModel = require("./../../models/Product");

exports.showSendCommentPageView = async (req, res, next) => {
  try {
    const { status } = req;
    const { id } = req.params;
    const product = await productModel.findOne({ _id: id });

    if (!product) {
      req.flash("error", "محصولی با این آیدی یافت نشد !");
      return res.redirect("back");
    }
    return res.render("comment/sendComment", {
      product,
      status,
    });
  } catch (err) {
    next(err);
  }
};

exports.sendComment = async (req, res, next) => {
  try {
    const { title, text, stars, strengths, weakPoints } = req.body;
    const { user } = req;
    const { id } = req.params;

    const isValidProductId = isValidObjectId(id);

    if (!isValidProductId) {
      req.flash("error", "آیدی محصول معتبر نمی باشد !");
      return res.redirect("back");
    }

    const comment = new commentModel({
      title,
      strengths,
      weakPoints,
      stars,
      text,
      user: user._id,
      product: id,
    });

    await comment.save();

    req.flash(
      "success",
      "کامنت شما با موفقیت ثبت شد. پس از تائید منتشر می شود. "
    );
    return res.redirect("back");
  } catch (err) {
    next(err);
  }
};
