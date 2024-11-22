import express from "express";
import { authMiddleWare } from "../middlewares/authMiddleWare.js";
import { addplan, getPlans } from "../controllers/plansController.js";

const planRouter = express.Router();

planRouter.get("/", authMiddleWare, getPlans); // Endpoint to update profile
planRouter.post("/add", authMiddleWare, addplan); // Endpoint to update profile

export default planRouter;