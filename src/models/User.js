const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
    },
    nationalCode: {
      type: String,
      required: false,
    },
    cardNumber: {
      type: Number,
      required: false,
    },
    getNews: {
      type: String,
      enum: ["بله", "خیر"],
      default: "خیر",
    },
  },
  {
    timestamps: true,
  }
);

schema.pre("save", async function (next) {
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (err) {
    next(err);
  }
});

const model = mongoose.model("User", schema);

module.exports = model;
