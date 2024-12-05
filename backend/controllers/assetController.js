// ./controller/assetController.js
// import Joi from "joi";
import { apiResponseCode } from "../helper.js";
import { sumStringsToTwoDecimals } from "../utils/sumStringsToTwoDecimals.js";
import { subtractStringsToTwoDecimals } from "../utils/subtractStringsToTwoDecimals.js";
import Asset from "../models/Asset.js";
import Wallet from "../models/Wallet.js";
import mongoose from "mongoose";
import { customToUpperCase } from "../utils/customToUpperCase.js";

// add a new asset
const addUpdateAsset = async (req, res) => {
  // use this to add new, update failed and pending assets and completed

  const {
    name,
    description,
    price,
    volume,
    orderStatus,
    orderNumber,
    // client_id,
  } = req.body;

  // if client id is present run logic for admin req
  // if client id is not present, run logic for user
  // if (!client_id) {
  let userId = req.user.id;

  try {
    let newAsset = await Asset.findOne({ orderNumber, user: userId });
    if (newAsset) {
      // console.log("Testing");
      return res.status(400).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: `Order ${orderNumber} already exist.`,
        data: null,
      });
    }

    newAsset = new Asset({
      // name: customToUpperCase(name), // "LTC", "BTC", or "USDT"
      name: name.toUpperCase(),
      description,
      price,
      volume,
      orderStatus,
      orderNumber,
      user: userId, // Link the product to the authenticated user
    });

    await newAsset.save();

    return res.status(201).json({
      responseCode: apiResponseCode.SUCCESS,
      responseMessage: "Asset added successfully, awaiting verification",
      data: newAsset,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal server error",
      data: null,
    });
  }
};

// } else {
// check if client_id is present in data
// if (!client_id) {
//   return res.status(400).json({
//     responseCode: apiResponseCode.BAD_REQUEST,
//     responseMessage: "client_id is required.",
//     data: null,
//   });
// }

// let userId = client_id;

// try {
//   // Check if an asset with the same orderNumber exists for this user
//   const existingAsset = await Asset.findOne({ orderNumber, user: userId });

//   if (existingAsset) {
//     // update the wallet of a completed transaction of existting
//     // user befoe saving the data
//     if (orderStatus === "completed") {
//       const walletUpdate = await Wallet.findOne({ user: userId });
//       if (!walletUpdate) {
//         return res.status(404).json({
//           responseCode: apiResponseCode.NOT_FOUND,
//           responseMessage: "client_id wallet not found.",
//           data: null,
//         });
//       }
//       // Dynamically update the correct wallet based on the 'name' (currency)
//       if (name === "LTC" || name === "ltc") {
//         walletUpdate.LTC = sumStringsToTwoDecimals(walletUpdate.LTC, price);
//       } else if (name === "BTC" || name === "btc") {
//         walletUpdate.BTC = sumStringsToTwoDecimals(walletUpdate.BTC, price);
//       } else if (name === "USDT" || name === "usdt") {
//         walletUpdate.USDT = sumStringsToTwoDecimals(
//           walletUpdate.USDT,
//           price
//         );
//       } else {
//         return res.status(400).json({
//           responseCode: apiResponseCode.BAD_REQUEST,
//           responseMessage: "Invalid Asset name.",
//           data: null,
//         });
//       }
//       // Save the updated wallet balance
//       await walletUpdate.save();
//     }
//     // If asset exists, update the orderStatus
//     existingAsset.orderStatus = orderStatus;
//     existingAsset.price = price;
//     await existingAsset.save();

//     return res.status(200).json({
//       responseCode: apiResponseCode.SUCCESS,
//       responseMessage: "Order status updated successfully.",
//       data: existingAsset,
//     });
//   } else {
//     return res.status(404).json({
//       responseCode: apiResponseCode.NOT_FOUND,
//       responseMessage: "invalid client_id or transaction not found",
//       data: null,
//     });
//   }
// } catch (error) {
//   //   console.error(error);
//   // Check if error is a CastError
//   if (error instanceof mongoose.Error.CastError && error.path === "user") {
//     return res.status(400).json({
//       responseCode: apiResponseCode.BAD_REQUEST,
//       responseMessage: "Invalid client ID format",
//       data: null,
//     });
//   }
//   return res.status(500).json({
//     responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
//     responseMessage: "Internal Server Error.",
//     data: null,
//   });
// }
// };
// };

// fetch transaction history for authenticated user
const getAssetsHistory = async (req, res) => {
  try {
    let assets;
    let userId;

    // Fetch assets based on the provided userId in the request body or the authenticated user's ID
    if (req.body.userId) {
      userId = req.body.userId;
    } else {
      userId = req.user.id;
    }
    // const userId = req.body.userId || req.user.id;

    // Fetch assets associated with the userId
    assets = await Asset.find({ user: userId })
      .populate("user", "email")
      .exec();

    if (!assets || assets.length === 0) {
      return res.status(404).json({
        responseCode: apiResponseCode.USER_NOT_FOUND,
        responseMessage: "No assets found for the user",
        data: null,
      });
    }

    // Successful response
    return res.status(200).json({
      responseCode: apiResponseCode.SUCCESS,
      responseMessage: "Assets transaction history fetched successfully",
      data: assets,
    });
  } catch (err) {
    console.error("Error fetching assets history:", err.message);
    res.status(500).json({
      responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal server error",
      data: null,
    });
  }
};

const updateAsset = async (req, res) => {
  const { userId, description, name, price, orderNumber, orderStatus } =
    req.body;
  let balance;
  console.log("Line 199", orderStatus);

  try {
    const asset = await Asset.findOne({ user: userId, orderNumber, price });
    if (!asset) {
      res.status(400).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: "Order does not exist.",
        data: null,
      });
    }
    asset.orderStatus = orderStatus;

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      res.status(400).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: "User does not have a wallet",
        data: null,
      });
    }
    if (orderStatus === "completed") {
      if (name === "BTC" || name === "btc") {
        if (description === "Withdrawal") {
          balance = subtractStringsToTwoDecimals(wallet.BTC, price);
        } else {
          balance = sumStringsToTwoDecimals(wallet.BTC, price);
        }
        wallet.BTC = balance;
      } else if (name === "LTC" || name === "ltc") {
        if (description === "Withdrawal") {
          balance = subtractStringsToTwoDecimals(wallet.LTC, price);
        } else {
          balance = sumStringsToTwoDecimals(wallet.LTC, price);
        }
        wallet.LTC = balance;
      } else if (name === "USDT" || name === "usdt") {
        if (description === "Withdrawal") {
          balance = subtractStringsToTwoDecimals(wallet.USDT, price);
        } else {
          balance = sumStringsToTwoDecimals(wallet.USDT, price);
        }
        wallet.USDT = balance;
      }
    }

    await wallet.save();
    await asset.save();
    res.status(200).json({
      responseCode: apiResponseCode.SUCCESS,
      responseMessage: "Succesfully updated transaction.",
      data: null,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal server error",
      data: null,
    });
  }
};

export { addUpdateAsset, getAssetsHistory, updateAsset };
