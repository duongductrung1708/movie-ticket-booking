// websocket.js
const WebSocket = require("ws");

// Initialize WebSocket server
const wss = new WebSocket.Server({ port: 5000 });

wss.on("connection", (ws) => {
  console.log("Client connected to WebSocket server");

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

module.exports = { wss };
