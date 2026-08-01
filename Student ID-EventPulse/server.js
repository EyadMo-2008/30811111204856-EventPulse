require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

connectDB();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', database: 'Connected' });
});

io.on('connection', (socket) => {
  socket.on('joinRoom', async ({ eventId }) => {
    socket.join(eventId);
    const messages = await Message.find({ event: eventId }).sort({ createdAt: 1 });
    socket.emit('messageHistory', messages);
  });

  socket.on('broadcastAnnouncement', async ({ eventId, senderId, text, role }) => {
    if (role !== 'admin') return;
    
    const message = await Message.create({
      event: eventId,
      sender: senderId,
      text
    });

    io.to(eventId).emit('announcement', message);
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'An error happend in the server'
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));