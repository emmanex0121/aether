import express from "express";
import {
  authMiddleWare,
  adminAuthMiddleWare,
} from "../middlewares/authMiddleWare.js";
import {
  addUpdateAsset,
  // addUpdateConfirmedAsset,
  getAssetsHistory,
  updateAsset,
  // getConfirmedAssets,
} from "../controllers/assetController.js";

const assetRouter = express.Router();
// const adminAssetRouter = express.Router();

// add asset
assetRouter.post("/add", authMiddleWare, addUpdateAsset);
// adminAssetRouter.put("/update", adminAuthMiddleWare, addUpdateAsset);
assetRouter.post("/transactions", adminAuthMiddleWare, getAssetsHistory);
assetRouter.put("/transaction/update", adminAuthMiddleWare, updateAsset);

// get all assets
assetRouter.get("/history", authMiddleWare, getAssetsHistory);
// assetRouter.get("/", authMiddleWare, getConfirmedAssets);

// add confirmed assets
// adminAssetRouter.post("/confirm", adminAuthMiddleWare, addUpdateConfirmedAsset);
export { assetRouter };
