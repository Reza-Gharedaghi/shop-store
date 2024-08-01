const express = require("express");
const controller = require("./user.controller");
const { isLoginUser } = require("./../../middlewares/checkUserStatus");
const auth = require("./../../middlewares/auth");
const {
  editProfileValidator,
  changePasswordValidator,
  addressRegisterValidator,
} = require("./../../modules/user/user.validator");
const {
  validationErrorsHandler,
} = require("./../../middlewares/validationErrors");

const router = express.Router();

router.route("/profile").get(auth, isLoginUser, controller.showUserProfileView);

router
  .route("/profile/edit-infos")
  .get(auth, isLoginUser, controller.showEditProfileView)
  .post(
    auth,
    isLoginUser,
    editProfileValidator(),
    validationErrorsHandler,
    controller.editUserInfos
  );

router
  .route("/profile/change-password")
  .get(auth, controller.showChangePasswordView)
  .post(
    auth,
    changePasswordValidator(),
    validationErrorsHandler,
    controller.changePassword
  );

router
  .route("/profile/favorites")
  .get(auth, isLoginUser, controller.showFavoritesPageView);

router
  .route("/profile/add-favorites/product/:id")
  .post(auth, controller.addToFavorites);

router
  .route("/profile/remove-favorites/product/:id")
  .post(auth, controller.removeFromFavorites);

router
  .route("/profile/address")
  .get(auth, isLoginUser, controller.showUserAddressView);

router
  .route("/profile/address/register")
  .post(
    auth,
    addressRegisterValidator(),
    validationErrorsHandler,
    controller.userAddressRegister
  );

router
  .route("/profile/address/remove/:id")
  .post(auth, controller.removeAddress);

router
  .route("/profile/comments")
  .get(auth, isLoginUser, controller.showUserCommentsView);

module.exports = router;
