import User from "../models/User.js";
import { apiResponseCode } from "../helper.js";

// Fetch all users
const getUsers = async (req, res) => {
  try {
    // Fetch all users from the User collection
    const users = await User.find({}, "firstName lastName email"); // Specify the fields you want to return

    console.log(users);

    return res.status(200).json({
      responseCode: apiResponseCode.SUCCESS,
      responseMessage: "Users fetched successfully.",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal server error",
      data: null,
    });
  }
};

export { getUsers };
