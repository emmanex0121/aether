// ./models/Assets.js
import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    volume: {
      type: String,
      // required: true,
    },
    orderStatus: {
      type: String,
      required: true,
      default: "pending",
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    walletAddress: {
      type: String,
      default: "",
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

export default mongoose.model("Asset", assetSchema);
