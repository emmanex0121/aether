// import config from "../config.js"
import jwt from "jsonwebtoken";
import { apiResponseCode } from "../helper.js";
import config from "../config.js";
import User from "../models/User.js";

const authMiddleWare = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      responseCode: apiResponseCode.UNAUTHORIZED,
      responseMessage: "Access Denied. No token provided.",
      data: null,
    });
  }

  try {
    const decodedToken = jwt.verify(token, config.jwtsecret);
    console.log("Decoded JWT", decodedToken.id, ", ", decodedToken.email);

    // Find user associated with the token
    let user = await User.findById(decodedToken.id);
    console.log("Found User", user._id); //debug line

    if (!user) {
      return res.status(404).json({
        responseCode: apiResponseCode.USER_NOT_FOUND,
        responseMessage: "User not found.",
        data: null,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("MiddleWare Error", error);

    // Hamdling specify JWT Errors
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({
        respnseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: "Invalid token Format.",
        data: null,
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        respnseCode: apiResponseCode.UNAUTHORIZED,
        responseMessage: "Token Expired, Please signin again.",
        data: null,
      });
    }

    return res.status(500).json({
      respnseCode: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal Server error.",
      data: null,
    });
  }
};

export default authMiddleWare;
