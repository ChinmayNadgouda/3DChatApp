const Message = require("../models/Message"); 

const getLast100Messages = async (room) => {
    try {
      const messages = await Message.find({ room })  
        .sort({ __createdAt__: -1 })
        .limit(100) 
        .exec();
  
      return messages.reverse(); 
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
};

const saveMessage = (message, username, room) => {
    const message1 = new Message({
        message: message,
        username: username,
        room: room,
    });
    message1.save();
}
module.exports = { getLast100Messages, saveMessage };