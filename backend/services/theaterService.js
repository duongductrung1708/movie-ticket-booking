const Theater = require("../models/Theater");
const Room = require("../models/Room");
const Seat = require("../models/Seat");
const Showtime = require("../models/Showtime");

const TheaterService = {
  create: async (theaterData) => {
    const theater = new Theater(theaterData);
    return await theater.save();
  },

  getAll: async () => {
    return await Theater.find();
  },

  getById: async (theaterId) => {
    return await Theater.findById(theaterId);
  },

  update: async (theaterId, theaterData) => {
    return await Theater.findByIdAndUpdate(theaterId, theaterData, {
      new: true,
    });
  },

  delete: async (theaterId) => {
    const rooms = await Room.find({ theater_id: theaterId });

    for (let room of rooms) {
      await Seat.deleteMany({ roomId: room._id });
    }

    await Room.deleteMany({ theater_id: theaterId });

    return await Theater.findByIdAndDelete(theaterId);
  },

  // getShowtimesByTheater: async (theaterId) => {
  //   try {
  //     const rooms = await Room.find({ theater_id: theaterId }).select("_id");

  //     const roomIds = rooms.map((room) => room._id);

  //     const showtimes = await Showtime.find({ room_id: { $in: roomIds } })
  //       .populate({
  //         path: "movie_id",
  //         select: "title language duration genre",
  //         populate: {
  //           path: "genre",
  //           select: "name",
  //         },
  //       })
  //       .select("movie_id date start_time");

  //     return showtimes;
  //   } catch (error) {
  //     throw new Error("Error fetching showtimes by theater");
  //   }
  // },

  getShowtimesByTheater: async (theaterId) => {
    try {
      const theater = await Theater.findById(theaterId).select("rooms");

      if (!theater) {
        throw new Error("Theater not found");
      }

      const roomIds = theater.rooms;

      if (roomIds.length === 0) {
        throw new Error("No rooms found in this theater");
      }

      const showtimes = await Showtime.find({ room_id: { $in: roomIds } })
        .populate({
          path: "movie_id",
          select: "title language duration genre",
          populate: {
            path: "genre",
            select: "name",
          },
        })
        .select("movie_id date start_time end_time");

      return showtimes;
    } catch (error) {
      throw new Error("Error fetching showtimes by theater: " + error.message);
    }
  }
};

module.exports = TheaterService;
