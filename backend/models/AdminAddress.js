// ./models/Users.js

import mongoose from "mongoose";

const AdminAddressSchema = new mongoose.Schema(
  {
    ltcWallet: {
      type: String,
      default: "",
    },
    btcWallet: {
      type: String,
      default: "",
    },
    usdtWallet: {
      type: String,
      default: "",
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
