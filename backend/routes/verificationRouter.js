import express from "express";
import { adminAuthMiddleWare, authMiddleWare } from "../middlewares/authMiddleWare.js";
import {
  getUserVerification,
  submitVerification,
  updateVerification,
} from "../controllers/verificationController.js";

const verificationRouter = express.Router();

verificationRouter.post("/start", authMiddleWare, submitVerification);
verificationRouter.get("/", authMiddleWare, getUserVerification);
verificationRouter.put("/update", adminAuthMiddleWare, updateVerification);

export { verificationRouter };
