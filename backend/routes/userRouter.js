// routes/user.js
import express from "express";
import { getUsers } from "../controllers/userController.js";
import authMiddleWare from "../middlewares/authMiddleWare.js";

const userRouter = express.Router();

// endpoint to get all users
userRouter.get("/", authMiddleWare, getUsers); // Endpoint to update profile

// Endpoint to update profile
// userRouter.put("/profile", authMiddleware, updateProfile);

// userRouter.post("/add", authMiddleware, addUser); // Endpoint to update profile

export default userRouter;
