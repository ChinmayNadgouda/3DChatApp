function leaveRoom(username, chatRoomUsers) {
    return chatRoomUsers.filter((user) => user.username != username);
}
  
module.exports = leaveRoom;