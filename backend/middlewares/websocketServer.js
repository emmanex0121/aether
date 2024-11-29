import WebSocket, { WebSocketServer } from 'ws';

// Create WebSocket server
const wss = new WebSocketServer({ noServer: true });

// Listen for WebSocket connections
wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');

  // Listen for messages from the WebSocket client
  ws.on('message', (message) => {
    console.log('Received message from client:', message);
  });

  // Function to broadcast messages to all connected clients
  const sendMessageToClients = (message) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  // Expose the sendMessageToClients function globally
  global.sendMessageToClients = sendMessageToClients;
});

export { wss };
