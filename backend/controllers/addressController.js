import { apiResponseCode } from "../helper.js";
import AdminAddress from "../models/AdminAddress.js";

const getAddress = async (req, res) => {
  try {
    const addresses = await AdminAddress.findOne();
    if (!addresses) {
      return res.status(404).json({
        responseCode: apiResponseCode.NOT_FOUND,
        respopnseMessage: "No addresses found.",
        data: null,
      });
    }
    return res.status(200).json({
      responseCode: apiResponseCode.SUCCESS,
      responseMessage: "Wallets Addresses fetched successfully",
      data: addresses,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal Server Error",
      data: addresses,
    });
  }
};

const addAddress = async (req, res) => {
  try {
    const { ltcWallet, btcWallet, usdtWallet } = req.body;

    if (!ltcWallet && !btcWallet && !usdtWallet) {
      return res.status(400).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage:
          "Incomplete data: At least one field must be provided.",
        data: null,
      });
    }

    let address = await AdminAddress.findOne();

    if (!address) {
      // Create new user information
      // address = new AdminAddress({
      //   btcWallet,
      //   ltcWallet,
      //   usdtWallet,
      // });
      address = new AdminAddress();

      // // save the new user to database
      // await address.save();

      // return res.status(200).json({
      //   responseCode: apiResponseCode.SUCCESS,
      //   responseMessage: "Wallets Addresses Added successfully",
      //   data: address,
      // });
    }
    if (btcWallet || btcWallet?.trim()) {
      address.btcWallet = btcWallet;
    }
    if (usdtWallet || usdtWallet?.trim()) {
      address.usdtWallet = usdtWallet;
    }
    if (ltcWallet || ltcWallet?.trim()) {
      address.ltcWallet = ltcWallet;
    }

    await address.save();
    return res.status(200).json({
      responseCode: apiResponseCode.SUCCESS,
      responseMessage: "Wallets Addresses Updated successfully",
      data: address,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal Server Error",
      data: addresses,
    });
  }
};

export { getAddress, addAddress };
