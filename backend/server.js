const app = require('./app');
const { wss } = require("./websocket");

const WebSocket = require("ws");
const {
  handleWebSocketConnection,
} = require("./controllers/WebSocketController");
// Set up WebSocket handling
wss.on("connection", (ws) => handleWebSocketConnection(ws, wss));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
