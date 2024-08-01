const { body } = require("express-validator");

const sendCommentValidator = () => {
  return [
    body("title")
      .isString()
      .withMessage("عنوان کامنت خود باید به صورت متن (string) باشد !")
      .trim()
      .isLength({ min: 10, max: 30 })
      .withMessage("عنوان کامنت باید بین 10 الی 30 کاراکتر باشد !"),

    body("strengths")
      .isString()
      .withMessage("نقاط قوت باید به صورت متن (string) باشد !")
      .trim()
      .isLength({ min: 5, max: 50 })
      .withMessage("نقاط قوت باید بین 5 الی 50 کاراکتر باشد !"),

    body("weakPoints")
      .isString()
      .withMessage("نقاط ضعف باید به صورت متن (string) باشد !")
      .trim()
      .isLength({ min: 5, max: 50 })
      .withMessage("نقاط قوت باید بین 5 الی 50 کاراکتر باشد !"),

    body("stars")
      .isInt({ min: 1, max: 5 })
      .withMessage("تعداد ستاره باید بین 1 تا 5 باشد !"),

    body("text")
      .isString()
      .withMessage("متن کامنت باید به صورت متن (string) باشد !")
      .trim()
      .isLength({ min: 3, max: 500 })
      .withMessage("نقاط قوت باید بین 10 الی 500 کاراکتر باشد !"),
  ];
};

module.exports = { sendCommentValidator };
