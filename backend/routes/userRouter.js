// routes/user.js
import express from "express";
import { getUser, getUsers } from "../controllers/userController.js";
import {
  authMiddleWare,
  adminAuthMiddleWare,
} from "../middlewares/authMiddleWare.js";

const userRouter = express.Router();
const adminUserRouter = express.Router();

// endpoint to get all users
// adminUserRouter.get("/getusers", adminAuthMiddleWare, getUsers); // Endpoint to update profile
userRouter.get("/", authMiddleWare, getUser); // Endpoint to get user
userRouter.get("/getusers", adminAuthMiddleWare, getUsers); // Endpoint to update profile

// Endpoint to update profile
// userRouter.put("/profile", authMiddleware, updateProfile);

// userRouter.post("/add", authMiddleware, addUser); // Endpoint to update profile

export { userRouter, adminUserRouter };
