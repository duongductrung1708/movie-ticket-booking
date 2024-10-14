const Showtime = require("../models/Showtime");
const Room = require("../models/Room"); // Make sure to import the Room model
const { format } = require("date-fns");

// Get all showtimes
const getShowtime = async (req, res) => {
  try {
    const showtimes = await Showtime.find()
      .populate("movie_id", "title")
      .populate("room_id", "name");

    const formattedShowtimes = showtimes.map((st) => ({
      movie_id: st.movie_id._id,
      movie_title: st.movie_id.title || "Unknown Movie",
      room_id: st.room_id._id,
      room_name: st.room_id.name || "Unknown Room",
      date: format(new Date(st.date), "MM/dd/yyyy"),
      start_time: st.start_time,
      end_time: st.end_time,
      seatLayout: st.seatLayout,
    }));

    res.json(formattedShowtimes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get showtime by showtime id
const getShowtimeById = async (req, res) => {
  try {
    const showtimeId = req.params.showtimeId;
    const showtime = await Showtime.findById(showtimeId)
      .populate("movie_id", "title")
      .populate("room_id", "name");

    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found" });
    }

    const formattedShowtime = {
      movie_id: showtime.movie_id._id,
      movie_title: showtime.movie_id.title || "Unknown Movie",
      room_id: showtime.room_id._id,
      room_name: showtime.room_id.name || "Unknown Room",
      date: format(new Date(showtime.date), "MM/dd/yyyy"),
      start_time: showtime.start_time,
      end_time: showtime.end_time,
      seatLayout: showtime.seatLayout,
    };

    res.json(formattedShowtime);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get showtimes of a theater
const getShowtimeOfTheater = async (req, res) => {
  try {
    const theaterId = req.params.theaterId;
    const rooms = await Room.find({ theaterId: theaterId });
    const showtimes = await Showtime.find({
      room_id: { $in: rooms.map((r) => r._id) },
    })
      .populate("movie_id", "title")
      .populate("room_id", "name");

    const formattedShowtimes = showtimes.map((st) => ({
      movie_id: st.movie_id._id,
      movie_title: st.movie_id.title || "Unknown Movie",
      room_id: st.room_id._id,
      room_name: st.room_id.name || "Unknown Room",
      date: format(new Date(st.date), "MM/dd/yyyy"),
      start_time: st.start_time,
      end_time: st.end_time,
      seatLayout: st.seatLayout,
    }));

    res.json(formattedShowtimes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create showtime
const createShowtime = async (req, res) => {
  try {
    const { movie_id, room_id, date, start_time, end_time, seatLayout } =
      req.body;

    const showtime = new Showtime({
      movie_id,
      room_id,
      date,
      start_time,
      end_time,
      seatLayout,
    });

    await showtime.save();
    await showtime.populate("movie_id", "title");
    await showtime.populate("room_id", "name");

    const formattedShowtime = {
      movie_id: showtime.movie_id._id,
      movie_title: showtime.movie_id.title || "Unknown Movie",
      room_id: showtime.room_id._id,
      room_name: showtime.room_id.name || "Unknown Room",
      date: format(new Date(showtime.date), "MM/dd/yyyy"),
      start_time: showtime.start_time,
      end_time: showtime.end_time,
      seatLayout: showtime.seatLayout,
    };

    res.status(201).json(formattedShowtime);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update showtime
const updateShowtime = async (req, res) => {
  try {
    const showtimeId = req.params.id;
    const showtime = await Showtime.findByIdAndUpdate(showtimeId, req.body, {
      new: true,
    })
      .populate("movie_id", "title")
      .populate("room_id", "name");

    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found" });
    }

    const formattedShowtime = {
      movie_id: showtime.movie_id._id,
      movie_title: showtime.movie_id.title || "Unknown Movie",
      room_id: showtime.room_id._id,
      room_name: showtime.room_id.name || "Unknown Room",
      date: format(new Date(showtime.date), "MM/dd/yyyy"),
      start_time: showtime.start_time,
      end_time: showtime.end_time,
      seatLayout: showtime.seatLayout,
    };

    res.json(formattedShowtime);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getShowtime,
  getShowtimeById,
  getShowtimeOfTheater,
  createShowtime,
  updateShowtime,
};
