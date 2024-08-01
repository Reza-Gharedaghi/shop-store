const express = require("express");
const controller = require("./shopping.controller");
const auth = require("../../middlewares/auth");
const { isLoginUser } = require("../../middlewares/checkUserStatus");

const router = express.Router();

router.route("/cart").get(auth, isLoginUser, controller.showShoppingCartView);

router.route("/cart/add-product/:id").post(auth, controller.addProductToCart);

router
  .route("/cart/remove-product/:id")
  .post(auth, controller.removeProductFromCart);

router
  .route("/cart/increase-product-count/:id")
  .post(auth, controller.increaseProductCount);

router
  .route("/cart/decrease-product-count/:id")
  .post(auth, controller.decreaseProductCount);

module.exports = router;
