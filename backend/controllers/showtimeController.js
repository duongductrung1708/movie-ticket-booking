const Showtime = require("../models/Showtime");
const Room = require("../models/Room"); // Make sure to import the Room model
const { format } = require("date-fns");
const showtimeService = require("../services/showtimeService");
const { getTheaterOfRoom } = require("../services/theaterService");
const Theater = require("../models/Theater");

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

// get showtime by id
const getShowtimeById = async (req, res) => {
  try {
    const showtimeId = req.params.id;

    // Find the showtime by ID and populate the movie and room details
    let showtime = await Showtime.findById(showtimeId)
      .populate("movie_id", "title")
      .populate("room_id", "name");

    // Check if the showtime was found
    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found" });
    }

    // Find the theater associated with the room
    const theater = await Theater.findOne({ rooms: showtime.room_id });

    // Attach the found theater to the showtime
    showtime = {
      ...showtime._doc,
      theater: theater,
    };

    // Send the found showtime back to the client
    res.status(200).json(showtime);
  } catch (error) {
    console.error("Error fetching showtime:", error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

const getPaginatedShowtime = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const searchValue = req.query.searchValue || ""; // Get the search value from the query
    const searchRegex = new RegExp(searchValue, "i"); // 'i' for case-insensitive search

    // Aggregation query to search within the referenced fields
    const showtimes = await Showtime.aggregate([
      // Lookup for movie details
      {
        $lookup: {
          from: "movies", // The collection name of the movie schema
          localField: "movie_id", // Field in showtime collection
          foreignField: "_id", // Field in movie collection
          as: "movie",
        },
      },
      {
        $unwind: "$movie", // Unwind the movie array to a single object
      },
      // Lookup for room details
      {
        $lookup: {
          from: "rooms", // The collection name of the room schema
          localField: "room_id", // Field in showtime collection
          foreignField: "_id",
          as: "room",
        },
      },
      {
        $unwind: "$room", // Unwind the room array to a single object
      },
      // Lookup for theater details (based on rooms)
      {
        $lookup: {
          from: "theaters", // The collection name of the theater schema
          localField: "room._id", // Match with the room's ID
          foreignField: "rooms", // Match rooms in the theater schema
          as: "theater",
        },
      },
      {
        $unwind: "$theater", // Unwind the theater array to a single object
      },
      // Match the search value in movie title or room name
      {
        $match: {
          $or: [
            { "movie.title": { $regex: searchRegex } },
            { "room.name": { $regex: searchRegex } },
            { "theater.name": { $regex: searchRegex } }, // Search by theater name
          ],
        },
      },
      // Project only the required fields
      {
        $project: {
          "movie._id": 1,
          "movie.title": 1,
          "movie.image": 1,
          "room._id": 1,
          "room.name": 1,
          "room.image": 1,
          "room.type": 1,
          "theater._id": 1,
          "theater.name": 1,
          "theater.image": 1,
          "theater.address": 1,
          "theater.city": 1,
          date: 1,
          seatLayout: 1,
          start_time: 1,
          end_time: 1,
        },
      },
      // Sort by date and then by start time
      {
        $sort: {
          date: -1, // Sort by date in ascending order
          start_time: -1, // Sort by start time in ascending order
        },
      },
      // Apply pagination
      { $skip: skip },
      { $limit: limit },
    ]);

    // Get the total count for pagination (without skip and limit)
    const total = await Showtime.aggregate([
      {
        $lookup: {
          from: "movies",
          localField: "movie_id",
          foreignField: "_id",
          as: "movie",
        },
      },
      {
        $unwind: "$movie",
      },
      {
        $lookup: {
          from: "rooms",
          localField: "room_id",
          foreignField: "_id",
          as: "room",
        },
      },
      {
        $unwind: "$room",
      },
      {
        $lookup: {
          from: "theaters",
          localField: "room._id",
          foreignField: "rooms",
          as: "theater",
        },
      },
      {
        $unwind: "$theater",
      },
      {
        $match: {
          $or: [
            { "movie.title": { $regex: searchRegex } },
            { "room.name": { $regex: searchRegex } },
            { "theater.name": { $regex: searchRegex } },
          ],
        },
      },
      {
        $count: "totalCount",
      },
    ]);

    const totalCount = total.length > 0 ? total[0].totalCount : 0;

    res.status(200).json({
      showtimes,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (e) {
    console.error("Error fetching showtimes:", e);
    res.status(500).send("Server error");
  }
};

//Get showtimes by room id
const getShowtimesByRoomId = async (req, res) => {
  try {
    const roomId = req.params.id;
    const requestDate = new Date(req.query.date); // Parse the date from the request
    requestDate.setHours(0, 0, 0, 0); // Reset time to midnight for proper comparison

    const showtimes = await showtimeService.getShowtimesByRoomId(roomId);

    // Utility function to check if two dates are the same (ignoring time)
    const isSameDate = (date1, date2) => {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      d1.setHours(0, 0, 0, 0); // Reset hours for date1
      d2.setHours(0, 0, 0, 0); // Reset hours for date2
      return d1.getTime() === d2.getTime(); // Compare as timestamps
    };
    // Convert 12-hour time to 24-hour time
    const convertTo24HourFormat = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes; // Convert to total minutes for easy comparison
    };
    // Filter showtimes to include only those that match the requested date
    const responseData = showtimes
      .filter((st) => isSameDate(st.date, requestDate)) // Compare the showtime date with the request date
      .sort(
        (a, b) =>
          convertTo24HourFormat(a.start_time) -
          convertTo24HourFormat(b.start_time)
      ) // Sort by start_time
      .map((st) => {
        return {
          _id: st._id,
          movie: st.movie_id,
          date: st.date,
          start_time: st.start_time,
          end_time: st.end_time,
        };
      });

    res.status(200).json(responseData);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching showtimes." });
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
    const { movieId, roomId, date, startTime, endTime } = req.body;
    // Create a Date object
    let dateObj = new Date(date);

    // Format the date with time set to 00:00:00.000
    let formattedDate = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${dateObj
      .getDate()
      .toString()
      .padStart(2, "0")}T00:00:00.000+00:00`;

    const room = await Room.findById(roomId);
    // Function to convert 2D array of numbers to 2D array of seat objects
    const convertSeatLayout = (seatLayoutNumbers) => {
      return seatLayoutNumbers.map((row) =>
        row.map((seat) => {
          if (seat === 0) {
            return {
              type: "standard",
              status: "available",
              price: 100,
            };
          } else if (seat === -1) {
            return {
              type: "block",
              status: "blocked",
              price: 0,
            };
          }
        })
      );
    };
    const seatLayout = convertSeatLayout(room.seatLayout);

    const showtime = new Showtime({
      movie_id: movieId,
      room_id: roomId,
      date: formattedDate,
      start_time: startTime,
      end_time: endTime,
      seatLayout: seatLayout,
    });

    await showtime.save();
    await showtime.populate("movie_id", "title");
    await showtime.populate("room_id", "name");
    const theater = await getTheaterOfRoom(showtime.room_id._id);

    const formattedShowtime = {
      _id: showtime._id,
      movie: showtime.movie_id.title,
      room: showtime.room_id.name,
      date: showtime.date,
      start_time: showtime.start_time,
      end_time: showtime.end_time,
      seatLayout: showtime.seatLayout,
      theater: theater.name,
    };

    res.status(201).json({
      showtime: formattedShowtime,
      message: "Create Showtime Successfully",
    });
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

    const theater = await getTheaterOfRoom(showtime.room_id._id);

    const formattedShowtime = {
      _id: showtime._id,
      movie: showtime.movie_id.title,
      room: showtime.room_id.name,
      date: showtime.date,
      start_time: showtime.start_time,
      end_time: showtime.end_time,
      seatLayout: showtime.seatLayout,
      theater: theater.name,
    };
    res.status(200).json({
      message: "Update Showtime Successfully",
      showtime: formattedShowtime,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteShowtime = async (req, res) => {
  try {
    const id = req.params.id;

    await Showtime.deleteOne({ _id: id });
    return res.status(200).json("Delete Success");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getShowtimesByMovieId = async (req, res) => {
  try {
    const movieId = req.params.movieId;

    const showtimes = await Showtime.find({ movie_id: movieId })
      .populate("room_id", "name")
      .populate("movie_id", "title");

    const roomIds = showtimes
      .map((showtime) => (showtime.room_id ? showtime.room_id._id : null))
      .filter(Boolean);
    const rooms = await Room.find({ _id: { $in: roomIds } });

    const theaters = await Theater.find({ rooms: { $in: roomIds } });

    const formattedShowtimes = showtimes.map((showtime) => {
      const room = rooms.find((r) => r._id.equals(showtime.room_id._id));
      const theater = room
        ? theaters.find((t) => t.rooms.includes(room._id))
        : null;

      return {
        movie_id: showtime.movie_id,
        movie_title: showtime.movie_id.title || "Unknown Movie",
        room_id: room ? room._id : null,
        room_name: room ? room.name : "Unknown Room",
        theater_name: theater ? theater.name : "Unknown Theater",
        date: format(new Date(showtime.date), "MM/dd/yyyy"),
        start_time: showtime.start_time,
        end_time: showtime.end_time,
        seatLayout: showtime.seatLayout,
      };
    });

    res.status(200).json(formattedShowtimes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getShowtime,
  getPaginatedShowtime,
  getShowtimeOfTheater,
  createShowtime,
  updateShowtime,
  getShowtimesByRoomId,
  deleteShowtime,
  getShowtimeById,
  getShowtimesByMovieId,
};
