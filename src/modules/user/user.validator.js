const { body } = require("express-validator");

const editProfileValidator = () => {
  return [
    body("username")
      .isString()
      .withMessage("نام و نام خانوادگی شما باید به صورت متن باشد ! (string)")
      .isLength({ min: 6, max: 30 })
      .withMessage("نام و نام خانوادگی شما باید بین 6 تا 30 کاراکتر باشد !"),

    body("email")
      .isString()
      .withMessage("ایمیل شما باید به صورت متن باشد ! (string)")
      .isEmail()
      .withMessage("ایمیل شما معتبر نمی باشد !"),

    body("phone")
      .isString()
      .withMessage("شماره تلفن شما باید به صورت متن باشد ! (string)")
      .isMobilePhone(["fa-IR"])
      .withMessage("شماره تلفن شما معتبر نمی باشد !"),

    body("cardNumber")
      .optional({ checkFalsy: true })
      .isNumeric()
      .withMessage("شماره کارت شما باید به صورت عدد باشد !")
      .matches(/^\d{16}$/)
      .withMessage("شماره کارت شما باید 16 رقم باشد !"),

    body("nationalCode")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage(" کد ملی شما باید به صورت متن باشد !")
      .isLength({ min: 10, max: 10 })
      .withMessage("کد ملی شما باید 10 رقم باشد !"),
  ];
};

const changePasswordValidator = () => {
  return [
    body("password")
      .isString()
      .withMessage("رمز عبور شما باید به صورت متن باشد ! (string)")
      .isLength({ min: 8, max: 30 })
      .withMessage("رمز عبور شما باید بین 8 تا 30 کاراکتر باشد !")
      .isStrongPassword({
        minNumbers: 2,
        minUppercase: 1,
        minSymbols: 1,
      })
      .withMessage(
        "رمز عبور شما باید شامل حداقل 2 عدد + 1 حرف بزرگ انگلیسی و 1 علائم نگارشی باشد !"
      ),

    body("confirmPassword").custom((value, { req }) => {
      if (value === req.body.password) {
        return true;
      } else {
        throw new Error("تکرار رمز عبور با رمز عبور همخوانی ندارد !");
      }
    }),
  ];
};

const addressRegisterValidator = () => {
  return [
    body("username")
      .isString()
      .withMessage("نام و نام خانوادگی شما باید به صورت متن باشد ! (string)")
      .isLength({ min: 6, max: 30 })
      .withMessage("نام و نام خانوادگی شما باید بین 6 تا 30 کاراکتر باشد !"),

    body("phone")
      .isString()
      .withMessage("شماره تلفن شما باید به صورت متن باشد ! (string)")
      .isMobilePhone(["fa-IR"])
      .withMessage("شماره تلفن شما معتبر نمی باشد !"),

    body("postCode")
      .isString()
      .withMessage("لطفا کد پستی را در قالب درست ارسال نمایید !")
      .isPostalCode("IR")
      .withMessage("کد پستی وارد شده معتبر نمی باشد !")
      .isLength({ min: 10, max: 10 })
      .withMessage("کد پستی وارده باید 10 رقم باشد !"),

    body("state")
      .isString()
      .withMessage("لطفا نام استان را در قالب درست ارسال نمایید !"),

    body("city")
      .isString()
      .withMessage("لطفا نام استان را در قالب درست ارسال نمایید !"),

    body("completeAddress")
      .isString()
      .withMessage("آدرس وارد شده باید به صورت متن (string) ارسال شود !")
      .isLength({ min: 10, max: 150 })
      .withMessage("آدرس وارد شده باید بین 10 الی 150 کاراکتر باشد !"),
  ];
};

module.exports = {
  editProfileValidator,
  changePasswordValidator,
  addressRegisterValidator,
};
