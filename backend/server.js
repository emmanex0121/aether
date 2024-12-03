import express from "express";
import cors from "cors";
import path from "path";
import config from "./config.js";
import dbConnection from "./db/dbConnection.js";

// Routes
import authRouter from "./routes/auth.js";
import { assetRouter } from "./routes/assetRouter.js";
import { userRouter } from "./routes/userRouter.js";
import { walletRouter } from "./routes/walletRouter.js";
import { addressRouter } from "./routes/addressRouter.js";
import uploadRouter from "./routes/uploadRouter.js";
import planRouter from "./routes/planRouter.js";

// Middleware
import { authMiddleWare } from "./middlewares/authMiddleWare.js";

// Controllers
import { getAddress } from "./controllers/addressController.js";
import { updatePlansDaily } from "./controllers/plansController.js";
import { verificationRouter } from "./routes/verificationRouter.js";
import { chatRouter } from "./routes/chatRouter.js";
// import { countryRouter } from "./routes/countryRouter.js";

const app = express();

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse JSON payloads

// Database Connection
dbConnection(); // Database connection

// Routes
app.use("/api/uploads", uploadRouter);
app.use("/api/auth", authRouter);
app.use("/api/asset", assetRouter);
app.use("/api/wallet", walletRouter);
app.use("/api/address", authMiddleWare, getAddress);
app.use("/api/verification", verificationRouter);
app.use("/api/user/plans", planRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);

// for admin
// app.use("/api/admin/asset", adminAssetRouter); // comes with client_id
app.use("/api/admin/users", userRouter);
app.use("/api/admin/user", assetRouter);
app.use("/api/admin/user/verification", verificationRouter);
app.use("/api/admin/user", planRouter);
app.use("/api/admin/chat", chatRouter);
// app.use("/api/admin/wallet", walletRouter);

app.use("/api/admin/address", addressRouter);
// app.use("/api/country", countryRouter);

// Serve uploaded files statically
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Schedule task to update plans daily
updatePlansDaily();

// Start Server
app.listen(config.port, () => {
  console.log(`Server is running on ${config.port}`);
});
