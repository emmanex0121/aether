// ./routes/auth.js
import express from "express";
import { signInController, signUpController } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/signup", signUpController);

authRouter.post("/signin", signInController);

export default authRouter;
