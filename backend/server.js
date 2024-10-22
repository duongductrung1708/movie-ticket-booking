const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const genreRoutes = require('./routes/genreRoutes');
const theaterRoutes = require('./routes/theaterRoutes');
const roomRoutes = require('./routes/roomRoutes');
const seatRoutes = require('./routes/seatRoutes');
const logger = require("morgan");
const { paymentRouter, showtimeRouter } = require('./routes');
require('dotenv').config();
const createDefaultRoles = require('./controllers/roleController');
const connectDB = require('./config/db');
const corsOptions = require('./config/corsOptions');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const bookingDetailRoutes = require('./routes/bookingDetailRoutes');
const upcomingMovieRoutes = require('./routes/upcomingMovieRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const path = require('path');
const momoPaymentRouter = require('./routes/momoPaymentRoutes');
const cors = require('cors');


const WebSocket = require('ws');

const app = express();

// Middleware
app.use(express.json());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// app.use(corsOptions);

// Connect to MongoDB
connectDB().then(() => {
  createDefaultRoles();
});

//Get image route
app.use('/api/images', express.static(path.join(__dirname, 'assets')));

// Define routes
app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use('/api/payments', paymentRouter);
app.use('/api/showtimes', showtimeRouter)
app.use('/api/movies', movieRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/theaters', theaterRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/booking-details', bookingDetailRoutes);
app.use('/api/upcoming-movie', upcomingMovieRoutes);
app.use('/api/momo', momoPaymentRouter);

// Start server
const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Initialize WebSocket server (on a different port)
const wss = new WebSocket.Server({ port: 5000 });

wss.on('connection', (ws) => {
  console.log('A new client connected');

  // Send a welcome message to the client
  ws.send('Welcome to the standalone WebSocket server!');

  // Handle incoming messages from the client
  ws.on('message', (message) => {
    console.log('Received:', message);
    // Echo the message back to the client
    ws.send(`Server received: ${message}`);
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:5000');