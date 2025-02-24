const mongoose = require("mongoose");

// Define the Task schema
const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  room: {
    type: String,
    required: true
  },
  __createdAt__: {
    type: Date,
    default: Date.now,
  },
});

// Create the Task model
const Message = mongoose.model("chat", messageSchema);

module.exports = Message;