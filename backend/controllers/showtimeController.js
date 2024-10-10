const Showtime = require('../models/Showtime');
const { format } = require("date-fns");

// Get all showtime
const getShowtime = async (req, res) => {
    try {
        const showtimes = await Showtime.find()
            .populate('movie_id', 'title')
            .populate('room_id', 'name');

        const formattedShowtimes = showtimes.map((st) => ({
            movie_id: st.movie_id._id,
            movie_title: st.movie_id.title || 'Unknown Movie',
            room_id: st.room_id._id,
            room_name: st.room_id.name || 'Unknown Room',
            date: format(new Date(st.date), "yyyy-MM-dd"),
            start_time: st.start_time,
            end_time: st.end_time,
            seat_layout: st.seat_layout
        }));

        res.json(formattedShowtimes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get showtime of theater
const getShowtimeOfTheater = async (req, res) => {
    try {
        const theaterId = req.params.theaterId;
        const rooms = await Room.find({ theaterId: theaterId });
        const showtimes = await Showtime.find({ room_id: { $in: rooms.map(r => r._id) } })
            .populate('movie_id', 'title')
            .populate('room_id', 'name');

        const formattedShowtimes = showtimes.map((st) => ({
            movie_id: st.movie_id._id,
            movie_title: st.movie_id.title || 'Unknown Movie',
            room_id: st.room_id._id,
            room_name: st.room_id.name || 'Unknown Room',
            date: format(new Date(st.date), "yyyy-MM-dd"),
            start_time: st.start_time,
            end_time: st.end_time,
            seat_layout: st.seat_layout
        }));

        res.json(formattedShowtimes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Create showtime
const createShowtime = async (req, res) => {
    try {
        const { movie_id, room_id, date, start_time, end_time, seat_layout } = req.body;

        const showtime = new Showtime({
            movie_id,
            room_id,
            date,
            start_time,
            end_time,
            seat_layout
        });

        await showtime.save();
        await showtime.populate('movie_id', 'title');
        await showtime.populate('room_id', 'name');

        const formattedShowtime = {
            movie_id: showtime.movie_id._id,
            movie_title: showtime.movie_id.title || 'Unknown Movie',
            room_id: showtime.room_id._id,
            room_name: showtime.room_id.name || 'Unknown Room',
            date: format(new Date(showtime.date), "yyyy-MM-dd"),
            start_time: showtime.start_time,
            end_time: showtime.end_time,
            seat_layout: showtime.seat_layout
        };

        res.json(formattedShowtime);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update showtime
const updateShowtime = async (req, res) => {
    try {
        const showtimeId = req.params.showtimeId;
        const showtime = await Showtime.findByIdAndUpdate(showtimeId, req.body, { new: true })
            .populate('movie_id', 'title')
            .populate('room_id', 'name');

        const formattedShowtime = {
            movie_id: showtime.movie_id._id,
            movie_title: showtime.movie_id.title || 'Unknown Movie',
            room_id: showtime.room_id._id,
            room_name: showtime.room_id.name || 'Unknown Room',
            date: format(new Date(showtime.date), "yyyy-MM-dd"),
            start_time: showtime.start_time,
            end_time: showtime.end_time,
            seat_layout: showtime.seat_layout
        };

        res.json(formattedShowtime);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getShowtime,
    getShowtimeOfTheater,
    createShowtime,
    updateShowtime,
};
