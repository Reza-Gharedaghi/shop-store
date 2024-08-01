const { validationResult } = require("express-validator");

module.exports.validationErrorsHandler = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    req.flash("error", result.errors[0].msg);
    return res.redirect("back");
  } else {
    next();
  }
};
