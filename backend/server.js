const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require("./routes/userRoutes");
const mongoose = require('mongoose');
const logger = require("morgan");
const cors = require("cors");
const { paymentRouter } = require('./routes');
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
app.use("/api/users", userRoutes);
app.use('/api/payment', paymentRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

