import mongoose from "mongoose";

const verificationImagesSchema = new mongoose.Schema({
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  imageUrls: {
    type: [String],
    required: true,
    validate: {
      validator: function (value) {
        return (
          typeof value === "string" ||
          (Array.isArray(value) && value.every((v) => typeof v === "string"))
        );
      },
      message: "imageUrls must be a string or an array of strings",
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("VerificationImages", verificationImagesSchema);
