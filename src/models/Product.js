const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },
  colors: [
    {
      type: String,
      required: true,
    },
  ],
  productFeatures: {
    system: {
      type: String,
      required: true,
    },
    innerMemory: {
      type: String,
      required: true,
    },
    connectionNetworks: {
      type: String,
      required: true,
    },
    behindCameraCount: {
      type: String,
      required: true,
    },
  },
  warranty: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  seller: {
    type: String,
    default: "نیک کالا",
  },
  count: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

const model = mongoose.model("Product", schema);

module.exports = model;
