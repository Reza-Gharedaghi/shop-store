const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    strengths: {
      type: String,
    },
    weakPoints: {
      type: String,
    },
    isAccept: {
      type: Boolean,
      default: false,
    },
    stars: {
      type: Number,
      default: 5,
    },
    text: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "در انتظار تائید",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.model("Comment", schema);

module.exports = model;
