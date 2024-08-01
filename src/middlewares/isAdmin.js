const isAdmin = (req, res, next) => {
  const { user } = req;

  if (user.role === "ADMIN") {
    return next();
  } else {
    req.flash("error", "شما ادمین نیستید !");
    return res.redirect("/main");
  }
};

module.exports = isAdmin;
