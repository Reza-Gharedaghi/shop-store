const express = require("express");
const controller = require("./main.controller");
const { isLoginUser } = require("./../../middlewares/checkUserStatus");
const { contactUsValidator } = require("./main.validator");
const {
  validationErrorsHandler,
} = require("../../middlewares/validationErrors");

const router = express.Router();

router.route("/").get(isLoginUser, controller.showMainPageView);

router
  .route("/contact-us")
  .get(isLoginUser, controller.showContactUsView)
  .post(contactUsValidator(), validationErrorsHandler, controller.sendMessage);

module.exports = router;
