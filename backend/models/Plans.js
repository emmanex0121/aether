import mongoose from "mongoose";

const basicPlanSchema = new mongoose.Schema(
  {
    initialValue: { type: String, default: "0" },
    previousInitialValue: { type: String, default: "0" },
    currentInterest: { type: String, default: "0" },
    percentage: { type: String, immutable: true, default: "3" },
    days: {
      day1: { type: String },
      day2: { type: String },
      day3: { type: String },
      day4: { type: String },
      day5: { type: String },
      day6: { type: String },
      day7: { type: String },
      // Add remaining days as needed
    },
    lastProcessedDay: { type: Number, default: 0 },
  },
  { timestamps: true } // Individual timestamps for each sub-document
);

const silverPlanSchema = new mongoose.Schema(
  {
    initialValue: { type: String, default: "0" },
    previousInitialValue: { type: String, default: "0" },
    currentInterest: { type: String, default: "0" },
    percentage: { type: String, immutable: true, default: "128.69" },
    days: {
      day1: { type: String },
      day2: { type: String },
      day3: { type: String },

      // Add remaining days as needed
    },
    lastProcessedDay: { type: Number, default: 0 },
  },
  { timestamps: true } // Individual timestamps for each sub-document
);

const goldPlanSchema = new mongoose.Schema(
  {
    initialValue: { type: String, default: "0" },
    previousInitialValue: { type: String, default: "0" },
    currentInterest: { type: String, default: "0" },
    percentage: { type: String, immutable: true, default: "6" },
    days: {
      day1: { type: String },
      day2: { type: String },
      day3: { type: String },
      day4: { type: String },
      day5: { type: String },
      day6: { type: String },
      day7: { type: String },
      // Add remaining days as needed
    },
    lastProcessedDay: { type: Number, default: 0 },
  },
  { timestamps: true } // Individual timestamps for each sub-document
);

const planSchema = new mongoose.Schema(
  {
    basic: { type: basicPlanSchema },
    silver: { type: silverPlanSchema },
    gold: { type: goldPlanSchema },

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

export default mongoose.model("Plans", planSchema);
