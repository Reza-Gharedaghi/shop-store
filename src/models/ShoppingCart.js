const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isOrdered: {
    type: Boolean,
    default: false,
  },
  count: {
    type: Number,
    default: 1,
  },
  finalPrice: {
    type: String,
    required: true,
  },
});

const model = mongoose.model("ShoppingCart", schema);

module.exports = model;
