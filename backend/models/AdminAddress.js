// ./models/Users.js

import mongoose from "mongoose";

const AdminAddressSchema = new mongoose.Schema(
  {
    ltcWallet: {
      type: String,
      default: "0",
    },
    btcWallet: {
      type: String,
      default: "0",
    },
    usdtWallet: {
      type: String,
      default: "0",
    },
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("AdminAddress", AdminAddressSchema);
