const express = require('express');
const authRoutes = require('./routes/authRoutes');
const mongoose = require('mongoose');
const logger = require("morgan");
const cors = require("cors");
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());

app.use(logger("dev"));

app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

