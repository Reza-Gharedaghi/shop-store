const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
const path = require("path");
const { setHeaders } = require("./middlewares/setHeaders");
const mainPageRoutes = require("./modules/main/main.routes");
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/user/user.routes");
const productRoutes = require("./modules/product/product.routes");
const shoppingRoutes = require("./modules/shopping/shopping.routes");
const adminRoutes = require("./modules/admin/admin.routes");
const searchRoutes = require("./modules/search/search.routes");
const commentRoutes = require("./modules/comment/comment.routes");
const apiDocsRoutes = require("./modules/api-docs/swagger.routes");
const categoryModel = require("./models/Category");
const brandModel = require("./models/Brand");
const productModel = require("./models/Product");

const app = express();

//* Body Parser
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

//* Set Headers
app.use(setHeaders);

//* Public Files
app.use(express.static(path.join(__dirname, "..", "public")));

//* Ejs Config
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//* Cookie Parser
app.use(cookieParser());

//* Session Configs
app.use(
  session({
    secret: "Secret Key",
    resave: false,
    saveUninitialized: false,
  })
);

//* Express Flash
app.use(flash());

//* Main Routes
app.use("/main", mainPageRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/shopping", shoppingRoutes);
app.use("/admin", adminRoutes);
app.use("/search", searchRoutes);
app.use("/comment", commentRoutes);
app.use("/api-docs", apiDocsRoutes);

//* 404 Error Handler
app.use((req, res) => {
  return res.render("errors/404");
});

//* Server Errors
app.use((err, req, res, next) => {
  return res.render("errors/serverError", {
    err,
  });
});

module.exports = app;
