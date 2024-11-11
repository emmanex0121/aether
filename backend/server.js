import express from "express";
import cors from "cors";
import config from "./config.js";
import dbConnection from "./db/dbConnection.js";
import authRouter from "./routes/auth.js";
import { assetRouter, adminAssetRouter } from "./routes/assetRouter.js";
import userRouter from "./routes/userRouter.js";

const app = express();

app.use(express.json()); // Middleware to parse JSON payloads
app.use(cors()); // Middleware to enable CORS for cross-origin requests

// Routes
// for users
app.use("/api/auth", authRouter);
app.use("/api/asset", assetRouter);

// for admin
app.use("/api/admin/asset", adminAssetRouter); // comes with client_id
app.use("/api/admin/users", userRouter);

dbConnection(); // Database connection
app.listen(config.port, () => {
  console.log(`Server is running on ${config.port}`);
});
