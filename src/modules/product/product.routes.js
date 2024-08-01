const express = require("express");
const controller = require("./product.controller");
const { isLoginUser } = require("./../../middlewares/checkUserStatus");

const router = express.Router();

router.route("/:id").get(isLoginUser, controller.showProductView);

module.exports = router;
