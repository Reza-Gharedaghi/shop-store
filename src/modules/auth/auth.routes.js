const express = require("express");
const controller = require("./auth.controller");
const {
  registerValidator,
  loginValidator,
  forgetPassValidator,
  resetPassValidator,
} = require("./../../modules/auth/auth.validator");
const {
  validationErrorsHandler,
} = require("./../../middlewares/validationErrors");

const auth = require("./../../middlewares/auth");

const router = express.Router();

router
  .route("/register")
  .get(controller.showRegisterView)
  .post(registerValidator(), validationErrorsHandler, controller.register);

router
  .route("/login")
  .get(controller.showLoginView)
  .post(loginValidator(), validationErrorsHandler, controller.login);

router.route("/refresh-token").get(controller.refreshToken);

router
  .route("/forget-password")
  .get(controller.showForgetPasswordView)
  .post(
    forgetPassValidator(),
    validationErrorsHandler,
    controller.forgetPassword
  );

router.route("/reset-password/:token").get(controller.showResetPasswordView);

router
  .route("/reset-password")
  .post(
    resetPassValidator(),
    validationErrorsHandler,
    controller.resetPassword
  );

router.route("/logout").get(auth, controller.logOut);

module.exports = router;
