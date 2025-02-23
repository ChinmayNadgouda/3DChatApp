require("dotenv").config();
const express = require('express');
const http = require('http');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const leaveRoom = require('./service/leave-room'); 
const cors = require('cors');
const { Server } = require('socket.io');
const { getLast100Messages, saveMessage } = require('./service/mongodb')
const { JSONRPCServer } = require("json-rpc-2.0");
const rpcServer = new JSONRPCServer();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


const app = express();
app.use(bodyParser.json());
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

rpcServer.addMethod("getLast100Messages", async ({ query }) => {
  let room = query;

  if (!room) return [];

  try {
    const last100Messages = await getLast100Messages(room); 
    return last100Messages; 
  } catch (err) {
    console.error("Error fetching messages:", err);
    return []; 
  }
});

app.post("/jsonrpc", async (req, res) => {
  const jsonRPCRequest = req.body;
  const response = await rpcServer.receive(jsonRPCRequest);
  if (response) {
    res.json(response);
  } else {
    res.status(400).json({ error: "Invalid JSON-RPC request" });
  }
});

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
      socket.to(room).emit('chatroom_users', {room, chatRoomUsers});
      socket.emit('chatroom_users', {room, chatRoomUsers});
  });

  socket.on('send_message', (data) => {
      const { message, username, room, __createdAt__ } = data;
      io.in(room).emit('notify', room);
      socket.in(room).emit('spin', room);
      socket.emit('spin', room);
      io.in(room).emit('receive_message', data);
      saveMessage(message, username, room);
    });

});

server.listen(4000, () => 'Server is running on port 4000');