const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
}));

const users = {};

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});


io.on('connection', (socket) => {
  console.log('connected userId :', socket.id);

  socket.on('registerUser', (username) => {
    console.log(`${username} connected with socket ID: ${socket.id}`);
  });

  socket.on('sendMessage', ({ sender, receiver, message }) => {
    console.log(`${sender} sends message to ${receiver}: ${message}`);
    const receiverSocketId = users[receiver];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', { sender, message });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`server port ${PORT}`);
});
