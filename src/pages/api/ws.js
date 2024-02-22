import { Server } from 'socket.io';
import { createServer } from 'http';

// Security best practices:
// - Set CORS restrictions:
const allowedOrigins = ['http://localhost:3000', 'https://your-production-domain.com']; // Adjust as needed
// - Configure authentication/authorization (if necessary):
//   const jwtSecret = 'your-secure-jwt-secret'; // Example; use a strong secret

export default async (req, res) => {
    if (req.url === '/api/socket.io/' || req.url === '/api/socket.io') {
        console.log("Hitting server");
    }
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io');
    const httpServer = createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('okay');
    });

    const io = new Server(httpServer, {
      cors: {
        origin: allowedOrigins,
        // Add other required CORS options like credentials
      },
      // Authentication/authorization (if used):
      // auth: (socket, callback) => {
      //   const token = socket.handshake.auth.token;
      //   // Verify JWT authenticity, then call callback with success/error
      // },
    });

    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('A user connected');

      socket.on('send-chat-message', (data) => {
        // Validate and sanitize data (security)
        // ...

        // Handle the chat message, and optionally, save it to the database
        console.log('Received chat message:', data);

        // Broadcast the chat message to all connected clients
        io.emit('chat', data);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });

    httpServer.listen(3001, () => {
      console.log('Socket.io server listening on port 3001');
    });
  } else {
    console.log('socket.io already running');
  }

  res.end();
};
