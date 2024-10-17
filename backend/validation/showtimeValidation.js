const Showtime = require("../models/Showtime");


const showtimeValidation = {
    verifyTime: async (req, res, next) => {
        try {
            const { startTime, endTime, date, roomId } = req.body;
            console.log("hihih");


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
            let parts = date.split('/'); // Split the date string into [DD, MM, YYYY]

            const requestDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]) + 1);

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
    }

}

module.exports = showtimeValidation;