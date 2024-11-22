import schedule from "node-schedule";
import { processPlan } from "../utils/updatePlans.js";
import Plans from "../models/Plans.js";
import { apiResponseCode } from "../helper.js";

const updatePlansDaily = async () => {
  console.log("Cron job triggered: ", new Date()); // Log when the cron job is triggered
  try {
    const plans = await Plans.find().populate("user"); // Ensure user data is available
    if (!plans.length) {
      console.log("No users have plans");
      return;
    }

    for (const plan of plans) {
      const { basic, silver, gold } = plan;

      // updat plans based on the logic un updatPlans
      await processPlan(basic, 7), plan.user;
      await processPlan(silver, 3, plan.user);
      await processPlan(gold, 7, plan.user);

      // Save updated plan
      await plan.save();
    }
  } catch (err) {
    console.error(err.message);
  }
};

const getPlans = async (req, res) => {
  try {
    const plan = await Plans.findOne({ user: req.user });
    if (!plan) {
      return res.status(404).json({
        responseCode: apiResponseCode.USER_NOT_FOUND,
        responseMessage: "user plans not found",
        data: null,
      });
    }
    await processPlan(plan.basic, 7, req.user); // Max 7 days for "Basic"
    await processPlan(plan.silver, 3, req.user); // Max 3 days for "Silver"
    await processPlan(plan.gold, 7, req.user); // Max 7 days for "Gold"

    await plan.save(); // Save the updated plan

    return res.status(200).json({
      responseCode: apiResponseCode.SUCCESS,
      responseMessage: "user Plans fetched succesfully",
      data: plan,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal Server Error",
      data: null,
    });
  }
};

const addplan = async (req, res) => {
  const { initialValue, selectedPlan } = req.body;
  if (!initialValue || !selectedPlan) {
    return res.status(400).json({
      responseCode: apiResponseCode.BAD_REQUEST,
      responseMessage: "plan type and initial amount required!",
      data: null,
    });
  }
  const initAmount = parseFloat(initialValue);
  if (initAmount < 250) {
    return res.status(400).json({
      responseCode: apiResponseCode.BAD_REQUEST,
      responseMessage: "Initial Amount must be greater than 250",
      data: null,
    });
  }
  let plan = await Plans.findOne({ user: req.user });
  if (!plan) {
    plan = new Plans({
      [selectedPlan]: { initialValue: initialValue },
      user: req.user,
    });
    await plan.save();
    return res.status(200).json({
      responseCode: apiResponseCode.SUCCESS,
      responseMessage: `Plan added succesfully`,
      data: plan,
    });
  }
  plan[selectedPlan].initialValue = initialValue;
  await plan.save();

  return res.status(200).json({
    responseCode: apiResponseCode.SUCCESS,
    responseMessage: `Plan added succesfully`,
    data: plan,
  });
};

// Schedule the task to run daily at 11:59 PM
schedule.scheduleJob("59 23 * * *", { tz: "UTC" }, updatePlansDaily);
export { updatePlansDaily, getPlans, addplan };
