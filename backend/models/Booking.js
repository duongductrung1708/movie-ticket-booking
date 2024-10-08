const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  showtime_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Showtime",
    required: true,
  },
  seat_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seat",
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, required: true },
});

module.exports = mongoose.model("Booking", bookingSchema);
