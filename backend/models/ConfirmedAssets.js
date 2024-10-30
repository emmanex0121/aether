// ./models/Assets.js
import mongoose from "mongoose";

const confirmedAssetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: String,
      required: true,
    },
    volume: {
      type: String,
      required: true,
    },
    // orderStatus: {
    //   type: String,
    //   required: true,
    //   //   default: "confi",
    // },
    // orderNumber: {
    //   type: String,
    //   required: true,
    // },
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

export default mongoose.model("ConfirmedAsset", confirmedAssetSchema);
