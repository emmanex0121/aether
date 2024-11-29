import express from "express";
import {
  adminAuthMiddleWare,
  authMiddleWare,
} from "../middlewares/authMiddleWare.js";
import {
  addChatId,
  chatHistory,
  closeChat,
  getChatMessages,
  //   getUpdates,
  //   saveChat,
  sendMessages,
} from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.post("/sendMessage", authMiddleWare, sendMessages);
// chatRouter.get("/getUpdates", authMiddleWare, getUpdates);
chatRouter.get("/messages", authMiddleWare, getChatMessages);

// chatRouter.post("/save", authMiddleWare, saveChat);
chatRouter.post("/close", authMiddleWare, closeChat);
chatRouter.get("/", authMiddleWare, chatHistory);

chatRouter.post("/addChatId", adminAuthMiddleWare, addChatId);

export { chatRouter };
