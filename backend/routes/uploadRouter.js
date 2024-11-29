import express from "express";
import { authMiddleWare } from "../middlewares/authMiddleWare.js";
import { uploadHandler } from "../controllers/uploadController.js";

const uploadRouter = express.Router();

uploadRouter.post("/", authMiddleWare, uploadHandler); // Endpoint to update profile

export default uploadRouter;
