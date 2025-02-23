const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
require("dotenv").config();
const leaveRoom = require('./service/leave-room'); 
const cors = require('cors');
const { Server } = require('socket.io');
const { getLast100Messages, saveMessage } = require('./service/mongodb')

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


const app = express();
app.use(cors()); 
const server = http.createServer(app);
// const CHAT_BOT = 'ChatBot';
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

let allUsers = []; 

io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);

  socket.on('leave_room', (data) => {
      const { username, room } = data;
      socket.leave(room);
      const __createdAt__ = Date.now();
      allUsers = leaveRoom(username, allUsers);
      const chatRoomUsers = allUsers
      socket.to(room).emit('chatroom_users', { room, chatRoomUsers});
      // socket.to(room).emit('receive_message', {
      //   username: CHAT_BOT,
      //   message: `${username} has left the chat`,
      //   __createdAt__,
      // });
      console.log(`${username} has left the chat`);
  });


  socket.on('join_room', (data) => {
      const { username, room } = data; 
      
      socket.join(room); 
      // let __createdAt__ = Date.now();
      // socket.to(room).emit('receive_message', {
      // message: `${username} has joined the chat room`,
      // username: CHAT_BOT,
      // __createdAt__: __createdAt__,
      // });
      // socket.emit('receive_message', {
      //     message: `Welcome ${username}`,
      //     username: CHAT_BOT,
      //     __createdAt__: __createdAt__,
      //   });
      if(!allUsers.some(user => user.username == username && user.room == room)) {
        allUsers.push({ id: socket.id, username, room });
      }
      chatRoomUsers = allUsers.filter((user) => user.room === room);
      socket.to(room).emit('chatroom_users', {room, chatRoomUsers});
      socket.emit('chatroom_users', {room, chatRoomUsers});
      getLast100Messages(room)
      .then((last100Messages) => {
          socket.emit('last_100_messages', last100Messages);
      })
      .catch((err) => console.log(err));
  });

  socket.on('send_message', (data) => {
      const { message, username, room, __createdAt__ } = data;
      io.in(room).emit('notify', room);
      socket.emit('spin', room);
      io.in(room).emit('receive_message', data);
      saveMessage(message, username, room);
    });

});

server.listen(4000, () => 'Server is running on port 4000');