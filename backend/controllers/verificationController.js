import { apiResponseCode } from "../helper.js";
import User from "../models/User.js";
import VerificationImages from "../models/verificationImages.js";

const submitVerification = async (req, res) => {
  try {
    const {firstName, lastName, imageUrls, verificationStatus } = req.body;

    if (!imageUrls) {
      return res.status(400).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: "Images is required.",
        data: null,
      });
    }

    req.user.verificationStatus = verificationStatus;
    await req.user.save();

    let verificationImages = await VerificationImages.findOne({
      user: req.user,
    });
    if (!verificationImages) {
      verificationImages = new VerificationImages({
        imageUrls,
        user: req.user.id,
      });
    }
    verificationImages.imageUrls = imageUrls;
    await verificationImages.save();

    return res.status(200).json({
      responseCode: apiResponseCode.SUCCESS,
      responseMessage: "Verification Succesfully Initiated",
      data: imageUrls,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal Server Error",
      data: null,
    });
  }
};

const getUserVerification = async (req, res) => {
  return res.status(200).json({
    responseCode: apiResponseCode.SUCCESS,
    responseMessage: "User Verification Status Fetched",
    data: {
      verificationStatus: req.user.verificationStatus,
    },
  });
};

const updateVerification = async (req, res) => {
  const { userId, verificationStatus } = req.body;
  if (!userId || !verificationStatus) {
    return res.status(400).json({
      responseCode: apiResponseCode.BAD_REQUEST,
      responseMessage: "No userId or verificationStatus provided.",
      data: null,
    });
  }
  // const user = await User.findOne({ _id: userId });
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      responseCode: apiResponseCode.USER_NOT_FOUND,
      responseMessage: `User ${userId} does not exist.`,
      data: null,
    });
  }
  user.verificationStatus = verificationStatus;
  await user.save();

  return res.status(200).json({
    responseCode: apiResponseCode.SUCCESS,
    responseMessage: "User Verification Status updated.",
    data: {
      userId,
      verificationStatus,
    },
  });
};

export { submitVerification, getUserVerification, updateVerification };
