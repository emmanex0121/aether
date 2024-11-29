import User from "../models/User.js";
import { apiResponseCode } from "../helper.js";

// Fetch all users
const getUsers = async (req, res) => {
  try {
    // Fetch all users from the User collection
    console.log("Starting");
    const users = await User.find(
      {},
      "firstName lastName email _id verificationStatus"
    ); // Specify the fields you want to return

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

const getUser = async (req, res) => {
  try {
    return res.status(200).json({
      responseCode: apiResponseCode.SUCCESS,
      responseMessage: "User Information Succesfully fetched",
      data: req.user,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal server error",
      data: null,
    });
  }
};

export { getUsers, getUser };
