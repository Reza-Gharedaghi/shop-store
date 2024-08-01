const mongoose = require("mongoose");
const { v4: uuid4 } = require("uuid");

const schema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expire: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

schema.statics.createToken = async (user) => {
  const token = uuid4();
  const expire = Date.now() + 30 * 24 * 60 * 60 * 1000;

  const refreshToken = new model({
    token,
    user: user._id,
    expire,
  });

  await refreshToken.save();

  return refreshToken.token;
};

schema.statics.verifyToken = async (token) => {
  const refreshToken = await model.findOne({ token });

  if (refreshToken && refreshToken.expire >= Date.now()) {
    return refreshToken;
  } else {
    return null;
  }
};

const model = mongoose.model("RefreshToken", schema);

module.exports = model;
