import { apiResponseCode } from "../helper.js";
import Wallet from "../models/Wallet.js";
import User from "../models/User.js";
// import mongoose from "mongoose";

// get wallets
const getWallet = async (req, res) => {
  // console.log("hehehhehehehehe");
  try {
    // fetch wallets
    const wallets = await Wallet.findOne();
    // console.log("line 11 wallet controller", wallets);
    if (!wallets) {
      return res.status(400).json({
        responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
        responseMessage: "Internal Server Error",
        data: null,
      });
    }
    if (wallets.length === 0) {
      wallets = await Wallet.create({
        LTC: "0",
        BTC: "0",
        USDT: "0",
        user: req.user.id,
      });
    }
    return res.status(200).json({
      responseCode: apiResponseCode.SUCCESS,
      responseMessage: "Wallets fetched successfully",
      data: wallets,
    });
  } catch (error) {
    console.error("line 32 wallet controller", error);
    return res.status(500).json({
      responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal Server Error",
      data: null,
    });
  }
};

const updateWallet = async (req, res) => {
  try {
    // const adminUser = await User.find({ user: req.user.id });
    // if (!adminUser) {
    //   return res.status(401).json({
    //     responseCode: apiResponseCode.UNAUTHORIZED,
    //     responseMessage: "Unauthorized Access",
    //     data: null,
    //   });
    // }

    // full is boolean for if its new full amount
    const { LTC, BTC, USDT, full, client_id } = req.body;

    if (!client_id) {
      return res.status(400).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: "client_id is required",
        data: null,
      });
    }

    if (full) {
      const wallets = await Wallet.findOne({ user: client_id });
      if (!wallets) {
        return res.status(404).json({
          responseCode: apiResponseCode.NOT_FOUND,
          responseMessage: "client_id does not exist",
          data: null,
        });
      }

      // update wallet fields
      wallets.LTC = LTC;
      wallets.BTC = BTC;
      wallets.USDT = USDT;

      // Save the updated wallet
      await wallets.save();
      return res.status(200).json({
        responseCode: apiResponseCode.SUCCESS,
        responseMessage: "client_id wallet succesfully updated",
        data: wallets,
      });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal Server Error",
      data: null,
    });
  }
};

const clientUpdateWallet = async (req, res) => {
  try {
    const { LTC, BTC, USDT } = req.body;

    const wallets = await Wallet.findOne({ user: req.user });
    if (!wallets) {
      return res.status(404).json({
        responseCode: apiResponseCode.NOT_FOUND,
        responseMessage: "client_id does not exist",
        data: null,
      });
    }
    // update wallet fields
    if (LTC) {
      wallets.LTC = LTC;
    }
    if (BTC) {
      wallets.BTC = BTC;
    }
    if (USDT) {
      wallets.USDT = USDT;
    }
    // Save the updated wallet
    await wallets.save();
    return res.status(200).json({
      responseCode: apiResponseCode.SUCCESS,
      responseMessage: "client_id wallet succesfully updated",
      data: wallets,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal Server Error",
      data: null,
    });
  }
};

export { getWallet, updateWallet, clientUpdateWallet };
