// Helper function to update plan details
import Wallet from "../models/Wallet.js";

const processPlan = async (plan, planDetails, maxDays, user) => {
  // Add 'async' here
  if (!planDetails || planDetails.initialValue <= 0) return;

  const now = new Date();
  const lastUpdate = new Date(planDetails.updatedAt || now); // Tracks when the plan was last updated
  const daysElapsed = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24)); // Calculate elapsed days

  // Check if initial value has changed, indicating a new investment
  const initialValue = parseFloat(planDetails.initialValue || 0);
  const previousInitialValue = parseFloat(
    planDetails.previousInitialValue || 0
  );
  const percentage = parseFloat(planDetails.percentage || 0);

  if (initialValue <= 0 || percentage <= 0) return; // Ensure valid values

  if (initialValue < 250) {
    throw new Error("Minimum investment amount is 250");
  }
  // Reset plan if `initialValue` changes
  if (initialValue !== previousInitialValue) {
    // planDetails.currenInterest = "0";
    // planDetails.days = {};
    // planDetails.lastProcessedDay = 0;
    // planDetails.previousInitialValue = initialValue;
    // await plan.save();
    Object.assign(planDetails, {
      currentInterest: "0",
      days: {},
      lastProcessedDay: 0,
      previousInitialValue: initialValue,
    });
    await plan.save();
    return;
    // await planDetails.save(); // Persist reset?
  }

  // Calculate interest for each day if there has been a valid initialValue
  if (daysElapsed > 0) {
    const percentage = parseFloat(planDetails.percentage);

    for (
      let i = 1;
      i <= daysElapsed && planDetails.lastProcessedDay < maxDays;
      i++
    ) {
      const nextDay = planDetails.lastProcessedDay + 1; // Calculate the next day
      const dayKey = `day${nextDay}`;

      if (!planDetails.days[dayKey]) {
        // Calculate interest for the current day
        const dailyInterest = (percentage / 100) * initialValue;
        planDetails.currenInterest = (
          parseFloat(planDetails.currenInterest || 0) + dailyInterest
        ).toString();
        planDetails.days[dayKey] = planDetails.currenInterest;
        planDetails.lastProcessedDay = nextDay; // Update the last processed day
      }
      // Save after each day's calculation
      // await planDetails.save();
      // return;
    }

    // If plan period ends, calculate ROI and update wallet
    if (planDetails.lastProcessedDay >= maxDays) {
      const totalReturn =
        initialValue + parseFloat(planDetails.currenInterest || 0);
      await updateWallet(user._id, totalReturn); // Now works as expected with async

      // Reset plan after completion
      planDetails.initialValue = "0";
      planDetails.currenInterest = "0";
      planDetails.days = {};
      planDetails.lastProcessedDay = 0;
      // planDetails.updatedAt = now;

      // await planDetails.save(); // Persist reset
      // return;
    }
    // Update `updatedAt` to now
    planDetails.updatedAt = now;
    plan.save();
    // return;
    // await planDetails.save();
  }
};

// Function to update the user's wallet
const updateWallet = async (userId, amountToAdd) => {
  try {
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      console.log(`Wallet not found for user ${userId}`);
      return;
    }

    wallet.USDT = (parseFloat(wallet.USDT) + amountToAdd).toFixed(2); // Add ROI to wallet
    await wallet.save();
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
//           planDetails.currenInterest = (
//             parseFloat(planDetails.currenInterest) + dailyInterest
//           ).toString();
//           planDetails.days[dayKey] = planDetails.currenInterest;
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
//       parseFloat(planDetails.currenInterest) +
//       (percentage / 100) * initialValue;

//     // Update currentInterest
//     planDetails.currenInterest = currentInterest.toString();

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
