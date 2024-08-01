const express = require("express");
const controller = require("./comment.controller");
const { sendCommentValidator } = require("./comment.validator");
const {
  validationErrorsHandler,
} = require("./../../middlewares/validationErrors");
const auth = require("./../../middlewares/auth");

const router = express.Router();

router
  .route("/product/:id")
  .get(auth, controller.showSendCommentPageView)
  .post(
    auth,
    sendCommentValidator(),
    validationErrorsHandler,
    controller.sendComment
  );

module.exports = router;
