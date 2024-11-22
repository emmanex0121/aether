import express from "express";
import { adminAuthMiddleWare } from "../middlewares/authMiddleWare.js";
import { addAddress, getAddress } from "../controllers/addressController.js";

const addressRouter = express.Router();

addressRouter.post("/add", adminAuthMiddleWare, addAddress);
addressRouter.put("/update", adminAuthMiddleWare, addAddress);
addressRouter.get("/", adminAuthMiddleWare, getAddress);

export { addressRouter };
