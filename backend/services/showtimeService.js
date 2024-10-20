const Showtime = require("../models/Showtime");

const showtimeService = {
    getShowtimesByRoomId: async (roomId) => {
        const showtimes = await Showtime.find({ room_id: roomId }).populate({ path: "movie_id" });
        return showtimes;
    },
    getShowtimeById: async (showtimeId) => {
        const showtime = await Showtime.findById(showtimeId)
        return showtime
    },
    updateSeatLayoutShowtime: async (showtimeId, seatIds, status) => {
        const showtime = await Showtime.findById(showtimeId)
        //update seat layout
        showtime.seatLayout = showtime.seatLayout.map((seatRow) => {
            return seatRow.map((seat) => {
                if (seatIds.includes(seat._id.toString())) {  // Ensure _id is compared as a string
                    console.log(`Updating seat: ${seat._id} from status ${seat.status} to ${status}`);
                    seat.status = status;
                }
                return seat;  // Return the updated seat
            });
        });

        // Save the updated showtime with the new seat layout
        await showtime.save();

        return showtime;
    },
    convertSeatFormat: (seatIds, seatLayout) => {

        // Function to convert seat coordinates to label
        const seatLabel = (row, col) => `${row + 1}${String.fromCharCode(65 + col)}`;
        
        const seatMap = {};
        const labels = [];

        // Flatten the 2D layout and create a map of ID to seat details
        seatLayout.forEach((row, rowIndex) => {
            row.forEach((seat, colIndex) => {
                seatMap[seat._id] = { seat, row: rowIndex, col: colIndex }; // Map ID to seat object and coordinates
            });
        });

        // Retrieve the seats based on the provided IDs and convert to labels
        seatIds.forEach(id => {
            if (seatMap[id]) {
                const { row, col } = seatMap[id];
                labels.push(seatLabel(row, col)); // Convert to seat label
            }
        });

        return labels;
    }
}

module.exports = showtimeService;