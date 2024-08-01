const { body } = require("express-validator");

const searchProductValidator = () => {
  return [
    body("productInfo")
      .isString()
      .withMessage("نام محصول باید به صورت متن (string) باشد !")
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage("نام محصول باید بین 3 الی 50 کاراکتر باشد !"),
  ];
};

module.exports = { searchProductValidator };
