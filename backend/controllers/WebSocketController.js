// controllers/WebSocketController.js
const WebSocket = require("ws");

const handleWebSocketConnection = (ws, wss) => {
  console.log("Client connected to WebSocket server");

  ws.on("message", (message) => {
    const { rowIndex, colIndex, status, showtime } = JSON.parse(message);

    // Broadcast message to all clients viewing the same showtime
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ rowIndex, colIndex, status, showtime }));
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
};

module.exports = {
  handleWebSocketConnection,
};
