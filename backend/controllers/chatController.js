import TelegramBot from "node-telegram-bot-api";
import config from "../config.js";
import { apiResponseCode } from "../helper.js";
import Chat from "../models/Chat.js";

const botToken = config.telegramBotToken;
const bot = new TelegramBot(botToken, { polling: true });
// const chatId = config.telegramChatId;

// Cache for incoming messages from Telegram
const messageCache = [];

// Listen for incoming Telegram messages
// bot.on("message", (msg) => {
//   if (msg.chat.id === parseInt(chatId)) {
// const newMessage = {
//   text: msg.text,
//   isOwnMessage: false, // Message from the agent
// };
//     messageCache.push(newMessage);
//   }
// });

// Listen for incoming Telegram messages
bot.on("message", async (msg) => {
  try {
    const chat = await Chat.findOne({ chatId: msg.chat.id, isClosed: false });

    if (chat) {
      const newMessage = {
        text: msg.text,
        isOwnMessage: false, // Message from the agent
      };
      messageCache.push(newMessage.text);

      // Ensure the `message` field is always an array and add the new message
      chat.messages.push(newMessage);
      await chat.save();
    }
    console.log(messageCache);
  } catch (err) {
    console.error("Error handling incoming message:", err.message);
  }
});

const addChatId = async (req, res) => {
  const { userId, chatId } = req.body;
  try {
    if (!userId || !chatId) {
      return res.status(400).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: "userId and chatId is required.",
        data: null,
      });
    }

    const chat = new Chat({
      user: userId,
      chatId,
    });

    await chat.save();
    return res.status(200).json({
      responseCode: apiResponseCode.SUCCESS,
      responseMessage: `Succesfully Added ChatId to user: ${userId}`,
      data: chat,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(200).json({
      responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal Server Error.",
      data: null,
    });
  }
};

const sendMessages = async (req, res) => {
  const { message } = req.body;
  const user = req.user;

  const chat = await Chat.findOne({ user: user, isClosed: false });

  if (!chat) {
    return res.status(400).json({
      responseCode: apiResponseCode.BAD_REQUEST,
      responseMessage: "NO CHAT FOUND.",
      data: null,
    });
  }

  // Construct the new message object
  const newMessage = {
    text: message,
    isOwnMessage: true, // Message sent from the front end
  };

  try {
    // Add the new message to the chat in the database
    chat.messages.push(newMessage);
    await chat.save();

    const response = await bot.sendMessage(chat.chatId, message);
    if (!response) {
      return res.status(400).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: "Message Sending failed.",
        data: null,
      });
    }

    // Optionally update the messageCache
    // messageCache.push(newMessage.text);

    return res.status(200).json({
      responseCode: apiResponseCode.SUCCESS,
      responseMessage: "Message Sent Succesfully.",
      data: response,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal Server Error.",
      data: null,
    });
  }
};

// Fetch cached messages for the frontend
const getChatMessages = (req, res) => {
  try {
    // Transform messageCache items into objects with the expected structure
    const messages = messageCache.map((msg) => ({
      text: msg,
      isOwnMessage: false, // Mark all messages as not sent by the user
    }));

    // Clear the cache after sending
    messageCache.splice(0, messageCache.length);

    res.status(200).json({
      responseCode: apiResponseCode.SUCCESS,
      responseMessage: "Message Fetched Successfully.",
      data: messages, // Clear cache after sending
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal Server Error.",
      data: null,
    });
  }
};

// const getUpdates = async (req, res) => {
//   try {
//     const updates = await bot.getUpdates();
//     if (!updates) {
//       return res.status(400).json({
//         responseCode: apiResponseCode.BAD_REQUEST,
//         responseMessage: "Fetch updates Failed.",
//         data: null,
//       });
//     }
//     return res.status(200).json({
//       responseCode: apiResponseCode.SUCCESS,
//       responseMessage: "Message Sent Succesfully.",
//       data: updates,
//     });
//   } catch (err) {
//     console.log(err.message);
//     return res.status(500).json({
//       responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
//       responseMessage: "Internal Server Error.",
//       data: null,
//     });
//   }
// };

// const saveChat = async (req, res) => {
//   const { message } = req.body;
//   const userId = req.user._id;

//   try {
//     const chat = await Chat.findOneAndUpdate(
//       { userId, isClosed: false },
//       { $push: { messages: message } },
//       { new: true, upsert: true }
//     );
//     res.status(200).json(chat);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// Fetch chat history
const chatHistory = async (req, res) => {
  //   const userId = req.user._id;

  try {
    const chat = await Chat.findOne({ user: req.user });
    if (!chat) {
      return res.status(400).json({
        responseCode: apiResponseCode.NOT_FOUND,
        responseMessage:
          "Chat not found for user. Admin needs to initiate chat ID",
        data: null,
      });
    }
    if (chat.isClosed) {
      chat.messages = [];
      chat.isClosed = false;
      await chat.save();
    }
    res.status(200).json({
      responseCode: apiResponseCode.SUCCESS,
      responseMessage: "Messages Fetched Successfully.",
      data: chat,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal Server Error.",
      data: null,
    });
  }
};

// Mark chat as closed
const closeChat = async (req, res) => {
  try {
    const chat = await Chat.findOneAndUpdate(
      { user: req.user },
      { isClosed: true, messages: [] },
      { new: true } // returns new and updated document
    );
    if (!chat) {
      return res.status(400).json({
        responseCode: apiResponseCode.NOT_FOUND,
        responseMessage: "Chat not found for user.",
        data: null,
      });
    }
    res.status(200).json({
      responseCode: apiResponseCode.SUCCESS,
      responseMessage: "Messages Fetched Successfully.",
      data: chat,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal Server Error.",
      data: null,
    });
  }
};

export {
  bot,
  sendMessages,
  //   getUpdates,
  getChatMessages,
  //   saveChat,
  chatHistory,
  addChatId,
  closeChat,
};
