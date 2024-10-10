const mongoose = require("mongoose");

const showtimeSchema = new mongoose.Schema({
  movie_id: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  room_id: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  date: {
    type: Date,
    required: true,
  },
  seat_layout: [
    {
      seat_number: String,
      row: String,
      column: Number,
      type: {
        type: String,
        enum: ["regular", "VIP"],
        required: true, 
      },
      status: {
        type: String,
        enum: ["available", "booked", "reserved"],
        default: "available",
      },
      price: {
        type: Number,
        required: true,
      },
    }
  ],  
  start_time: {
    type: String,
    required: true,
  },
  end_time: {
    type: String,
    required: true,
  },
});

const Showtime = mongoose.model("Showtime", showtimeSchema);

module.exports = Showtime;
