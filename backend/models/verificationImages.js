import mongoose from "mongoose";

const verificationImagesSchema = new mongoose.Schema({
  imageUrls: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("VerificationImages", verificationImagesSchema);
