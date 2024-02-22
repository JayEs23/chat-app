import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const ChatComponent = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const initSocket = () => {
        const serverURL = 'http://localhost:3000/api/socket.io'; // Remove trailing slash if needed
        const newSocket = io(serverURL.substring(0, serverURL.length - 1));


      newSocket.on('connect', () => {
        console.log('Connected to WebSocket server');
        setSocket(newSocket);
      });

      newSocket.on('chat', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      // Add more event handlers and error handling as needed

      return () => {
        if (newSocket) {
          newSocket.disconnect();
        }
      };
    };

    initSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();
    if (message.trim()) {
      socket.emit('send-chat-message', message);
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatComponent;
