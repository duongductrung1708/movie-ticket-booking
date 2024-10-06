const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const genreRoutes = require('./routes/genreRoutes');
const logger = require("morgan");
const cors = require("cors");
const { paymentRouter } = require('./routes');
require('dotenv').config();
const createDefaultRoles = require('./controllers/roleController');
const connectDB = require('./config/db');
const corsOptions = require('./config/corsOptions');

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
app.use('/api/payment', paymentRouter);
app.use('/api/movies', movieRoutes);
app.use('/api/genres', genreRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
