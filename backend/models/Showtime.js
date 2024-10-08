const mongoose = require("mongoose");

const showtimeSchema = new mongoose.Schema({
  movie_id: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  room_id: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  date: {
    type: Date,
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
