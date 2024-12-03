import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true }, // Message content
  isOwnMessage: { type: Boolean, required: true }, // Indicates if the message is from the agent
  timestamp: { type: Date, default: Date.now }, // Optional: Add a timestamp for each message
});

const chatSchema = new mongoose.Schema(
  {
    chatId: { type: String, default: "" },
    messages: {
      type: [messageSchema], // Array of message objects
      default: [], // Default to an empty array
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isClosed: { type: Boolean, default: false }, // Tracks if the chat is marked as closed
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt timestamps
  }
);

export default mongoose.model("Chat", chatSchema);
