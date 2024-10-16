const Showtime = require("../models/Showtime");

const showtimeService = {
    getShowtimesByRoomId: async (roomId) => {
        const showtimes = await Showtime.find({ room_id: roomId }).populate({ path: "movie_id" });
        return showtimes;
    }
}

module.exports = showtimeService;