const express = require("express");
const controller = require("./search.controller");
const { isLoginUser } = require("./../../middlewares/checkUserStatus");
const { searchProductValidator } = require("./search.validator");
const {
  validationErrorsHandler,
} = require("../../middlewares/validationErrors");

const router = express.Router();

router.route("/").get(isLoginUser, controller.showSearchPageView);

router
  .route("/demand-product")
  .post(
    isLoginUser,
    searchProductValidator(),
    validationErrorsHandler,
    controller.searchProduct
  );

module.exports = router;
