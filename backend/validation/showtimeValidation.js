const Showtime = require("../models/Showtime");


const showtimeValidation = {
    verifyTime: async (req, res, next) => {
        try {
            const { startTime, endTime, date, roomId } = req.body;

            const formatTime = (time) => {
                const [hour, minute] = time.split(":").map(Number); // Split time and convert to numbers
                const formattedHour = hour < 10 ? `0${hour}` : `${hour}`; // Add leading zero to hour if needed
                const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`; // Add leading zero to minute if needed
                return `${formattedHour}:${formattedMinute}`;
            }

            const formattedStartTime = formatTime(startTime);
            const formattedEndTime = formatTime(endTime);

            // Ensure startTime is less than endTime
            if (formattedStartTime >= formattedEndTime) {
                return res.status(400).send({ message: "Invalid time range: Start time must be less than end time." });
            }

            const requestDate = new Date(date);

            requestDate.setHours(0, 0, 0, 0); // Set time to 00:00:00 for accurate date comparison
            // return console.log(requestDate);

            // Get all showtimes for the given date by matching only the date part
            const showtimes = await Showtime.find({
                room_id: roomId,
                date: {
                    $gte: requestDate, // Start of the day (00:00:00)
                    $lt: new Date(requestDate.getTime() + 24 * 60 * 60 * 1000) // End of the day (23:59:59)
                }
            });

            // Check for time conflicts with the requested start and end time
            for (let showtime of showtimes) {
                let isOverlapping = (
                    (formattedStartTime <= showtime.end_time && formattedStartTime >= showtime.start_time) ||  // formattedStartTime falls within existing showtime range
                    (formattedEndTime >= showtime.start_time && formattedEndTime <= showtime.end_time) ||      // formattedEndTime falls within existing showtime range
                    (formattedStartTime <= showtime.start_time && formattedEndTime >= showtime.end_time)       // new range contains the entire showtime range
                );

                if (isOverlapping) {
                    return res.status(400).json({ message: "Showtime overlaps with an existing showtime." });
                }
            }

            req.body.date = requestDate;
            req.body.startTime = formattedStartTime;
            req.body.endTime = formattedEndTime;
            // If no conflict, proceed to the next middleware
            next();
        } catch (err) {
            console.log(err);

            res.status(500).send({ message: err.message });
        }
    },

    verifyConflictShowtime: async (req, res, next) => {
        try {
            // console.log(req.body);

            // Get the input data from the request body
            const {movieId, roomId, startTime, endTime, dates } = req.body;

            // Check for missing or empty roomId
            if (!roomId) {
                return res.status(400).json({
                    message: "Error: Room is required and cannot be empty."
                });
            }
            if (!movieId) {
                return res.status(400).json({
                    message: "Error: Movie is required and cannot be empty."
                });
            }

            // Check for missing or empty startTime
            if (!startTime) {
                return res.status(400).json({
                    message: "Error: startTime is required and cannot be empty."
                });
            }

            // Check for missing or empty endTime
            if (!endTime) {
                return res.status(400).json({
                    message: "Error: endTime is required and cannot be empty."
                });
            }

            // Check for missing or empty dates
            if (!dates || dates.length === 0) {
                return res.status(400).json({
                    message: "Error: dates are required and cannot be empty."
                });
            }

            // Continue with the rest of your code if all fields are valid


            // Convert dates to Date objects for querying
            // Convert dates to Date objects and set time to 00:00 (midnight)
            const dateObjects = dates.map(date => {
                const dateObj = new Date(date);
                dateObj.setHours(0, 0, 0, 0); // Set time to 00:00:00.000
                return dateObj;
            });


            // Query to find any conflicting showtimes
            const conflicts = await Showtime.find({
                room_id: roomId,
                date: { $in: dateObjects },
                $or: [
                    {
                        // Check if existing showtimes overlap with the requested time range
                        start_time: { $lt: endTime },
                        end_time: { $gt: startTime }
                    }
                ]
            });
            if (conflicts.length > 0) {
                // Create an array of dates that have conflicts
                const conflictDates = conflicts.map(conflict => {
                    // Format the conflict date as 'yyyy-mm-dd'
                    const conflictDate = conflict.date.toLocaleDateString();
                    return conflictDate;
                });

                // Create a unique list of conflict dates
                const uniqueConflictDates = [...new Set(conflictDates)];

                // Construct the message with specific conflict dates
                const message = `Conflict found with existing showtimes on: ${uniqueConflictDates.join(', ')}`;

                return res.status(409).json({
                    message: message, // Include specific conflict dates in the message
                    conflicts: conflicts
                });
            } else {
                next();
            }

        } catch (error) {
            // Handle any potential errors
            console.error("Error checking for conflicts:", error);
            return res.status(500).json({ message: "Internal server error." });
        }
    },

}



module.exports = showtimeValidation;