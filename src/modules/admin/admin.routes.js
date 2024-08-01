const express = require("express");
const controller = require("./admin.controller");
const auth = require("./../../middlewares/auth");
const isAdmin = require("./../../middlewares/isAdmin");

const router = express.Router();

router.route("/category").get(auth, isAdmin, controller.showAdminPanelView);

router
  .route("/category/users-manage")
  .get(auth, isAdmin, controller.showUsersManageView);

router
  .route("/category/user-manage/ban/:id")
  .post(auth, isAdmin, controller.userBan);

router
  .route("/category/user-manage/promote/:id")
  .post(auth, isAdmin, controller.promoteToAdmin);

router
  .route("/category/user-manage/depose/:id")
  .post(auth, isAdmin, controller.deposeToUser);

router
  .route("/category/user-manage/search-user")
  .post(auth, isAdmin, controller.searchUser);

router
  .route("/category/comments-manage")
  .get(auth, isAdmin, controller.showCommentManageView);

router
  .route("/category/comments-manage/accept-comment/:id")
  .post(auth, isAdmin, controller.acceptComment);

router
  .route("/category/comments-manage/reject-comment/:id")
  .post(auth, isAdmin, controller.rejectComment);

router
  .route("/category/comments-manage/search-comment")
  .post(auth, isAdmin, controller.searchComment);

module.exports = router;
