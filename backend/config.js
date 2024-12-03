import dotenv from "dotenv";

dotenv.config();
export default {
  port: process.env.PORT || 8001,
  connectionstring: process.env.CONNECTION_STRING,
  jwtsecret: process.env.JWT_SECRET,
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  telegramChatId: process.env.TELEGRAM_CHAT_ID,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASS,
};
