const { body } = require("express-validator");

const registerValidator = () => {
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

    body("email")
      .isString()
      .withMessage("ایمیل شما باید به صورت متن باشد ! (string)")
      .isEmail()
      .withMessage("ایمیل شما معتبر نمی باشد !"),

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

const loginValidator = () => {
  return [
    body("phone")
      .isString()
      .withMessage("شماره تلفن شما باید به صورت متن باشد ! (string)")
      .isMobilePhone(["fa-IR"])
      .withMessage("شماره تلفن شما معتبر نمی باشد !"),

    body("password")
      .isString()
      .withMessage("رمز عبور شما باید به صورت متن باشد ! (string)")
      .isLength({ min: 8, max: 30 })
      .withMessage("رمز عبور شما باید بین 8 تا 30 کاراکتر باشد !"),
  ];
};

const forgetPassValidator = () => {
  return [
    body("email")
      .isString()
      .withMessage("ایمیل شما باید به صورت متن باشد ! (string)")
      .isEmail()
      .withMessage("ایمیل شما معتبر نمی باشد !"),
  ];
};

const resetPassValidator = () => {
  return [
    body("password")
      .isString()
      .withMessage("رمز عبور شما باید به صورت متن باشد ! (string)")
      .isLength({ min: 8, max: 30 })
      .withMessage("رمز عبور شما باید بین 8 تا 30 کاراکتر باشد !")
      .isStrongPassword({ minNumbers: 2, minUppercase: 1, minSymbols: 1 })
      .withMessage(
        "رمز عبور شما باید شامل حداقل 2 عدد + 1 حرف بزرگ انگلیسی و 1 علائم نگارشی باشد !"
      ),
    body("confirmPassword").custom((value, { req }) => {
      if (value === req.body.password) {
        return true;
      } else {
        throw new Error("تکرار رمز عبور با رمز عبور وارد شده همخوانی ندارد !");
      }
    }),
  ];
};

module.exports = {
  registerValidator,
  loginValidator,
  forgetPassValidator,
  resetPassValidator,
};
