const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'occupied','blocked'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const showtimeSchema = new mongoose.Schema({
  movie_id: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  room_id: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  date: {
    type: Date,
    required: true,
  },
  seatLayout: {
    type: [[seatSchema]],
    required: true,
  },
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
