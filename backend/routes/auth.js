// ./routes/auth.js
import express from "express";
import {
  adminSignInController,
  adminSignUpController,
  signInController,
  signUpController,
} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/signup", signUpController);

authRouter.post("/signin", signInController);

authRouter.post("/admin/signin", adminSignInController);

authRouter.post("/admin/signup", adminSignUpController);

export default authRouter;
