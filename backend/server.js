const app = require('./app');
const { wss } = require("./websocket");

const WebSocket = require("ws");
const {
  handleWebSocketConnection,
} = require("./controllers/WebSocketController");

// const app = express();

// Middleware
// app.use(express.json());
// app.use(logger("dev"));
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());
// app.use(corsOptions);

// Connect to MongoDB
// connectDB().then(() => {
//   createDefaultRoles();
// });

// app.get("/", async (req, res) => {
//   res.send("Server is running")
// })
// //Get image route
// app.use("/api/images", express.static(path.join(__dirname, "assets")));

// // Define routes
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/payments", paymentRouter);
// app.use("/api/showtimes", showtimeRouter);
// app.use("/api/movies", movieRoutes);
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/genres", genreRoutes);
// app.use("/api/theaters", theaterRoutes);
// app.use("/api/rooms", roomRoutes);
// app.use("/api/seats", seatRoutes);
// app.use("/api/services", serviceRoutes);
// app.use("/api/bookings", bookingRoutes);
// app.use("/api/booking-details", bookingDetailRoutes);
// app.use("/api/upcoming-movie", upcomingMovieRoutes);
// app.use("/api/momo", momoPaymentRouter);

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

wss.on("connection", (ws) => handleWebSocketConnection(ws, wss));