import express from "express";
import authMiddleWare from "../middlewares/authMiddleWare.js";
import {
  addUpdateAsset,
  addUpdateConfirmedAsset,
  getAssetsHistory,
  getConfirmedAssets,
} from "../controllers/assetController.js";

const assetRouter = express.Router();
const adminAssetRouter = express.Router();

// add asset
assetRouter.post("/add", authMiddleWare, addUpdateAsset);
adminAssetRouter.post("/add", authMiddleWare, addUpdateAsset);

// get all assets
assetRouter.get("/history", authMiddleWare, getAssetsHistory);
assetRouter.get("/", authMiddleWare, getConfirmedAssets);

// add confirmed assets
adminAssetRouter.post("/confirm", authMiddleWare, addUpdateConfirmedAsset);
export { assetRouter, adminAssetRouter };
