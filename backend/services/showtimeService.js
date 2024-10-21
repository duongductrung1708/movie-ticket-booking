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
    updateSeatLayout: async (showtimeId, seat) => {
        try {
            // Find the showtime by ID
            const showtime = await Showtime.findById(showtimeId);

            // Check if showtime exists
            if (!showtime) {
                throw new Error("Showtime not found");
            }

            // Parse the seat string, assuming it's in the format "3B,4C"
            const seatArray = seat.split(',');

            seatArray.forEach((seatStr) => {
                // Split into column and row (e.g., 3B -> col 3, row 2)
                const col = parseInt(seatStr.charAt(0)) - 1; // Adjust for 0-based index
                const row = seatStr.charAt(1).charCodeAt(0) - 'A'.charCodeAt(0); // Convert letter to index (A -> 0, B -> 1, etc.)

                // Update the status of the seat to "occupied"
                if (showtime.seatLayout[row] && showtime.seatLayout[row][col]) {
                    showtime.seatLayout[row][col].status = "occupied";
                } else {
                    throw new Error(`Invalid seat position: ${seatStr}`);
                }
            });

            // Save the updated showtime
            await showtime.save();
            console.log("SeatLayout", showtime.seatLayout);
            return { success: true, message: "Seat layout updated successfully" };
        } catch (error) {
            return { success: false, message: error.message };
        }
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
        const seatLabel = (row, col) => `${String.fromCharCode(65 + row)}${col + 1}`;

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
    },
}

module.exports = showtimeService;