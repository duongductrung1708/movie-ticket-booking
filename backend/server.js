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

const app = express();

// Middleware
app.use(express.json());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(corsOptions);

// Connect to MongoDB
connectDB().then(() => {
  createDefaultRoles();
});

// Define routes
app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use('/api/payments', paymentRouter);
app.use('/api/showtimes',showtimeRouter)
app.use('/api/movies', movieRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/theaters', theaterRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/seats', seatRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

app.use('/services', serviceRoutes);
app.use('/bookings', bookingRoutes);
app.use('/booking-details', bookingDetailRoutes);
