// ./models/Users.js

import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    LTC: {
      type: String,
      default: "0",
    },
    BTC: {
      type: String,
      default: "0",
    },
    USDT: {
      type: String,
      default: "0",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Wallet", walletSchema);
