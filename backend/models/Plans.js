import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    basic: {
      initialValue: {
        type: String,
        default: "0",
      },
      previousInitialValue: {
        type: String,
        default: "0",
      },
      currentInterest: {
        type: String,
        default: "0",
      },
      percentage: {
        type: String,
        default: "3",
      },
      days: {
        day1: {
          type: String,
        },
        day2: {
          type: String,
        },
        day3: {
          type: String,
        },
        day4: {
          type: String,
        },
        day5: {
          type: String,
        },
        day6: {
          type: String,
        },
        day7: {
          type: String,
        },
      },
      lastProcessedDay: {
        type: Number,
        default: 0,
      },
    },
    silver: {
      initialValue: {
        type: String,
        default: "0",
      },
      previousInitialValue: {
        type: String,
        default: "0",
      },
      currentInterest: {
        type: String,
        default: "0",
      },
      percentage: {
        type: String,
        default: "128.69",
      },
      days: {
        day1: {
          type: String,
        },
        day2: {
          type: String,
        },
        day3: {
          type: String,
        },
      },
      lastProcessedDay: {
        type: Number,
        default: 0,
      },
    },
    gold: {
      initialValue: {
        type: String,
        default: "0",
      },
      previousInitialValue: {
        type: String,
        default: "0",
      },
      currentInterest: {
        type: String,
        default: "0",
      },
      percentage: {
        type: String,
        default: "6",
      },
      days: {
        day1: {
          type: String,
        },
        day2: {
          type: String,
        },
        day3: {
          type: String,
        },
        day4: {
          type: String,
        },
        day5: {
          type: String,
        },
        day6: {
          type: String,
        },
        day7: {
          type: String,
        },
      },
      lastProcessedDay: {
        type: Number,
        default: 0,
      },
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

export default mongoose.model("Plans", planSchema);
