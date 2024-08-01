const { body } = require("express-validator");

const contactUsValidator = () => {
  return [
    body("title")
      .isString()
      .withMessage("عنوان پیام را در قالب مناسب (string) ارسال کنید !")
      .isLength({ min: 5, max: 30 })
      .withMessage("عنوان پیام باید بین 5 تا 30 کاراکتر باشد !"),

    body("username")
      .isString()
      .withMessage(" نام و نام خانوادگی را در قالب مناسب (string) ارسال کنید !")
      .isLength({ min: 3, max: 30 })
      .withMessage(" نام و نام خانوادگی باید بین 5 تا 30 کاراکتر باشد !"),

    body("email")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage(" ایمیل را در قالب مناسب (string) ارسال کنید !")
      .isEmail()
      .withMessage("ایمیل وارد شده معتبر نمی باشد !"),

    body("phone")
      .isString()
      .withMessage("شماره تماس را در قالب مناسب (string) ارسال کنید !")
      .isMobilePhone("fa-IR")
      .withMessage("شماره تماس وارد شده معتبر نمی باشد !"),

    body("text")
      .isString()
      .withMessage("متن پیام را در قالب مناسب (string) ارسال کنید !")
      .isLength({ min: 10, max: 300 })
      .withMessage("متن پیام باید بین 10 الی 300 کاراکتر باشد !"),
  ];
};

module.exports = { contactUsValidator };
