
import { Server } from 'socket.io';

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log('Setting up Socket.io');

    const io = new Server(res.socket.server);

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Handle messages from clients
      socket.on('message', (message) => {
        io.emit('message', message); // Broadcast the message to all clients
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}
