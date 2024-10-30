// ./controller/assetController.js
// import Joi from "joi";
import { apiResponseCode } from "../helper.js";
import Asset from "../models/Asset.js";
import ConfirmedAssets from "../models/ConfirmedAssets.js";
import mongoose from "mongoose";

// add a new asset
const addUpdateAsset = async (req, res) => {
  //   const addUpdateAssetSchema = Joi.object({
  //     name: Joi.string().min(8).required(),
  //     description: Joi.string().required(),
  //     price: Joi.string().required(),
  //     orderStatus: Joi.string().required(),
  //     orderNumber: Joi.string().required(),
  //     client_id: Joi.string().allow(""),
  //   });

  //   // validate user request
  //   const { error } = signUpSchema.validate(req.body);
  //   if (error) {
  //     return res.status(400).json({
  //       responseCode: apiResponseCode.BAD_REQUEST,
  //       responseMessage: error.details[0].message,
  //       data: null,
  //     });
  //   }

  // use this to add new, update failed and pending assets and completed

  const {
    name,
    description,
    price,
    volume,
    orderStatus,
    orderNumber,
    client_id,
  } = req.body;

  // if client id is present run logic for admin req
  // if client id is not present, run logic for user
  if (!client_id) {
    let userId = req.user.id;

    try {
      let newAsset = Asset.findOne({ orderNumber, user: userId });
      if (newAsset) {
        // console.log("Testing");
        return res.status(400).json({
          responseCode: apiResponseCode.BAD_REQUEST,
          responseMessage: `Order ${orderNumber} already exist.`,
          data: null,
        });
      }

      newAsset = new Asset({
        name,
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
  } else {
    // check if client_id is present in data
    if (!client_id) {
      return res.status(400).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: "client_id is required.",
        data: null,
      });
    }

    let userId = client_id;

    try {
      // Check if an asset with the same orderNumber exists for this user
      const existingAsset = await Asset.findOne({ orderNumber, user: userId });

      if (existingAsset) {
        // If asset exists, update the orderStatus
        existingAsset.orderStatus = orderStatus;
        await existingAsset.save();

        return res.status(200).json({
          responseCode: apiResponseCode.SUCCESS,
          responseMessage: "Order status updated successfully.",
          data: existingAsset,
        });
      } else {
        return res.status(404).json({
          responseCode: apiResponseCode.USER_NOT_FOUND,
          responseMessage: "invalid client_id or client not found",
          data: null,
        });
      }
    } catch (error) {
      //   console.error(error);
      // Check if error is a CastError
      if (error instanceof mongoose.Error.CastError && error.path === "user") {
        return res.status(400).json({
          responseCode: apiResponseCode.BAD_REQUEST,
          responseMessage: "Invalid client ID format",
          data: null,
        });
      }
      return res.status(500).json({
        responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
        responseMessage: "Internal Server Error.",
        data: null,
      });
    }
  }
};

// fetch transaction history for authenticated user
const getAssetsHistory = async (req, res) => {
  try {
    // Fetch confirmed assets where the 'user' field matches the authenticated user's ID
    const assets = await Asset.find({ user: req.user.id })
      .populate("user", "email")
      .exec();

    return res.status(200).json({
      responseCode: apiResponseCode.SUCCESS,
      responseMessage: "Assets transaction history fetched successfully",
      data: assets,
    });
  } catch (error) {
    console.log("Error fetching history", error.message);
    res.status(500).json({
      responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal server error",
      data: null,
    });
  }
};

// add update confirmed assets FOR ADMIN
const addUpdateConfirmedAsset = async (req, res) => {
  try {
    const { name, description, price, volume, client_id } = req.body;

    // check if client_id is present in data
    if (!client_id) {
      return res.status(400).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: "client_id is required.",
        data: null,
      });
    }

    // admin would collect and send the user Id for the asset along with the asset info
    const userId = client_id;

    // check if asset name already existfor this user
    const confirmedAsset = await ConfirmedAssets.findOne({
      name,
      user: userId,
    });
    if (confirmedAsset) {
      // Convert string values to numbers, sum them, and save back as strings
      confirmedAsset.volume = (
        parseFloat(confirmedAsset.volume) + parseFloat(volume)
      )
        .toFixed(2)
        .toString();
      confirmedAsset.price = (
        parseFloat(confirmedAsset.price) + parseFloat(price)
      )
        .toFixed(2)
        .toString();

      await confirmedAsset.save();
      return res.status(200).json({
        responseCode: apiResponseCode.SUCCESS,
        responseMessage: "Confirmed Asset updated successfully",
        data: confirmedAsset,
      });
    } else {
      // Create a new asset record if it doesn't exist
      const newConfirmedAsset = new ConfirmedAssets({
        name,
        description,
        price,
        volume,
        user: userId,
      });

      await newConfirmedAsset.save();

      return res.status(201).json({
        responseCode: apiResponseCode.SUCCESS,
        responseMessage: "New confirmed asset created successfully",
        data: newConfirmedAsset,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

// fetch all confirmed assets for the authenticated user
const getConfirmedAssets = async (req, res) => {
  try {
    const getAssets = await ConfirmedAssets.find({ user: req.user.id })
      .populate("user", "email")
      .exec();

    if (!getAssets || getAssets.length === 0) {
      return res.status(404).json({
        responseCode: apiResponseCode.NOT_FOUND,
        responseMessage: "Assets not found.",
        data: null,
      });
    }

    return res.status(200).json({
      responseCode: apiResponseCode.SUCCESS,
      responseMessage: "Assets found.",
      data: getAssets,
    });
  } catch (error) {
    console.error("Error fetching confirmed assets:", error);
    res.status(500).json({
      responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal server error.",
      data: null,
    });
  }
};

export {
  addUpdateAsset,
  getAssetsHistory,
  addUpdateConfirmedAsset,
  getConfirmedAssets,
};
