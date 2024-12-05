// Helper function to update plan details
import Wallet from "../models/Wallet.js";
import Asset from "../models/Asset.js";

const processPlan = async (plan, planDetails, maxDays, user) => {
  if (!planDetails || planDetails.initialValue <= 0) return;

  // console.log(planDetails.updatedAt);

  const now = new Date();
  const lastUpdate = new Date(planDetails.updatedAt); // Tracks when the plan was last updated
  // console.log("Date now", now);
  // console.log("plan updated", planDetails.updatedAt);

  const daysElapsed = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24)); // Calculate elapsed days
  console.log("Days elapsed:", daysElapsed, "Last Update:", lastUpdate);

  // Check if initial value has changed, indicating a new investment
  const initialValue = parseFloat(planDetails.initialValue);
  const previousInitialValue = parseFloat(
    planDetails.previousInitialValue || 0
  );
  const percentage = parseFloat(planDetails.percentage);

  if (initialValue <= 0 || percentage <= 0) return; // Ensure valid values

  if (initialValue < 250) {
    throw new Error("Minimum investment amount is 250");
  }
  // Reset plan if `initialValue` changes
  if (initialValue !== previousInitialValue) {
    planDetails.currentInterest = "0";
    planDetails.days = {};
    planDetails.lastProcessedDay = 0;
    planDetails.previousInitialValue = initialValue;
    await plan.save();
  }
  // console.log("34.....", initialValue);

  // Calculate interest for each day if there has been a valid initialValue
  if (daysElapsed > 0) {
    console.log("Processing interest for", daysElapsed, "days");
    const percentage = parseFloat(planDetails.percentage);
    // console.log("48 ...");

    for (
      let i = 1;
      i <= daysElapsed && planDetails.lastProcessedDay < maxDays;
      i++
    ) {
      // console.log("51....");
      const nextDay = planDetails.lastProcessedDay + 1; // Calculate the next day
      const dayKey = `day${nextDay}`;

      if (!planDetails.days[dayKey]) {
        // console.log("initialval", initialValue);
        console.log("Processing interest for current day", nextDay);

        // Calculate interest for the current day
        const dailyInterest = (percentage / 100) * initialValue;
        planDetails.currentInterest = (
          parseFloat(planDetails.currentInterest) + dailyInterest
        ).toString();
        // console.log("currentInterest", planDetails.currentInterest);
        planDetails.days[dayKey] = planDetails.currentInterest;
        planDetails.lastProcessedDay = nextDay; // Update the last processed day
      }
      // console.log("73...");
      // Save after each day's calculation
      await plan.save();
      // return;
    }

    // If plan period ends, calculate ROI and update wallet
    if (planDetails.lastProcessedDay >= maxDays) {
      const totalReturn =
        initialValue + parseFloat(planDetails.currentInterest);
      await updateWallet(user._id, totalReturn); // Now works as expected with async

      // Reset plan after completion
      planDetails.initialValue = "0";
      planDetails.previousInitialValue = "0";
      planDetails.currentInterest = "0";
      planDetails.days = {};
      planDetails.lastProcessedDay = 0;
    }
    await plan.save();
  }
};

// Function to update the user's wallet
const updateWallet = async (userId, amountToAdd) => {
  const generateRandomUUID = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  try {
    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      console.log(`Wallet not found for user ${userId}`);
      return;
    }
    const transactionAsset = new Asset({
      name: "USDT",
      description: "Inv. With.",
      price: amountToAdd.toFixed(2),
      orderStatus: "completed",
      orderNumber: generateRandomUUID(),
      user: userId, // Link the product to the authenticated user
    });
    wallet.USDT = (parseFloat(wallet.USDT) + amountToAdd).toFixed(2); // Add ROI to wallet
    await wallet.save();
    await transactionAsset.save();

    console.log(`Wallet updated for user ${userId}: +$${amountToAdd}`);
  } catch (err) {
    console.error(`Error updating wallet for user ${userId}:`, err.message);
  }
};

export { processPlan };

////////////////////
// VERSION 2 //
// const processPlan = (planDetails, maxDays) => {
//   const now = new Date();
//   const lastUpdate = new Date(planDetails.updatedAt); // Tracks when the plan was last updated
//   const daysElapsed = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24)); // Calculate elapsed days

//   if (daysElapsed > 0) {
//     const initialValue = parseFloat(planDetails.initialValue);
//     const percentage = parseFloat(planDetails.percentage);

//     if (initialValue > 0 && initialValue > 250) {
//       for (
//         let i = 1;
//         i <= daysElapsed && planDetails.lastProcessedDay < maxDays;
//         i++
//       ) {
//         const nextDay = planDetails.lastProcessedDay + 1; // Calculate the next day
//         const dayKey = `day${nextDay}`;

//         if (!planDetails.days[dayKey]) {
//           // Calculate interest for the current day
//           const dailyInterest = (percentage / 100) * initialValue;
//           planDetails.currentInterest = (
//             parseFloat(planDetails.currentInterest) + dailyInterest
//           ).toString();
//           planDetails.days[dayKey] = planDetails.currentInterest;
//           planDetails.lastProcessedDay = nextDay; // Update the last processed day
//         }
//       }
//     }
//   }
// };
// export { processPlan };

//////////////////////
// OLD //
// const updatePlan = (planDetails, maxDays) => {
//   const initialValue = parseFloat(planDetails.initialValue);

//   if (initialValue > 0 && initialValue > 250) {
//     const percentage = parseFloat(planDetails.percentage);
//     const initialValue = parseFloat(planDetails.initialValue);
//     const currentInterest =
//       parseFloat(planDetails.currentInterest) +
//       (percentage / 100) * initialValue;

//     // Update currentInterest
//     planDetails.currentInterest = currentInterest.toString();

//     // Update the next available day field
//     for (let i = 1; i <= maxDays; i++) {
//       const dayKey = `day${i}`;
//       if (!planDetails.days[dayKey]) {
//         planDetails.days[dayKey] = currentInterest.toString();
//         break;
//       }
//     }
//   }
// };

// export { updatePlan };
