import express from "express";
import cors from "cors";
import config from "./config.js";
import dbConnection from "./db/dbConnection.js";
import authRouter from "./routes/auth.js";
import { assetRouter, adminAssetRouter } from "./routes/assetRouter.js";
import userRouter from "./routes/userRouter.js";
import { walletRouter } from "./routes/walletRouter.js";
import { addressRouter } from "./routes/addressRouter.js";
import { authMiddleWare } from "./middlewares/authMiddleWare.js";
import { getAddress } from "./controllers/addressController.js";
import planRouter from "./routes/planRouter.js";
import { updatePlansDaily } from "./controllers/plansController.js";

const app = express();

app.use(express.json()); // Middleware to parse JSON payloads
app.use(cors()); // Middleware to enable CORS for cross-origin requests
dbConnection(); // Database connection

// Routes
// for users
app.use("/api/auth", authRouter);
app.use("/api/asset", assetRouter);
app.use("/api/wallet", walletRouter);
app.use("/api/address", authMiddleWare, getAddress);
app.use("/api/user/plans/", authMiddleWare, planRouter);

// for admin
app.use("/api/admin/asset", adminAssetRouter); // comes with client_id
app.use("/api/admin/users", userRouter);
app.use("/api/admin/address", addressRouter);

// Schedule task to update plans daily
updatePlansDaily();

app.listen(config.port, () => {
  console.log(`Server is running on ${config.port}`);
});
