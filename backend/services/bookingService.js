const Booking = require("../models/Booking");
const BookingDetail = require("../models/BookingDetail");

const bookingService = {
    createBooking: async (userId, showtimeId, roomId, seat, status) => {
        const newBooking = new Booking({
            user_id: userId,
            showtime_id: showtimeId,
            room_id: roomId,
            seat: seat,
            status: status,
        });
        await newBooking.save()
        console.log("Create Booking", newBooking);

        return newBooking;
    },
    getBookingByUserId: async (userId) => {
        const booking = await Booking.find({ user_id: userId }).populate({ path: "showtime_id" }).populate({ path: "room_id" });
        console.log("Booking of user", booking);

        return booking;
    },
    getBookingDetailByBookingId: async (bookingId) => {
        const bookingDetails = await BookingDetail.find({ booking_id: bookingId }).populate({ path: "service_id" })
        console.log("Booking Details of user", bookingDetails);
        return bookingDetails;
    },
    updateBooking: async (bookingId, status) => {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            throw new Error("Booking not found");
        }
        booking.status = status;
        await booking.save();
        console.log("Booking", booking);
        return booking;
    }
    ,
    createBookingDetails: async (bookingId, services) => {
        try {
            // Map over services array and return an array of promises
            const savedDetails = await Promise.all(
                services.map(async (service) => {
                    // Create a new booking detail object
                    const bookingDetail = new BookingDetail({
                        booking_id: bookingId,
                        service_id: service._id, // Assuming service has an id property
                        quantity: service.quantity, // Assuming service has a quantity property
                    });
                    // Save the booking detail to the database
                    return await bookingDetail.save();
                })
            );

            console.log("Create Booking Details", savedDetails);

            return savedDetails; // Return all the saved booking details
        } catch (error) {
            console.error('Error creating booking details:', error);
            throw new Error('Failed to create booking details'); // Handle the error appropriately
        }
    },
    deleteBooking: async (bookingId) => {
        try {
            // Delete the booking by ID
            await Booking.deleteOne({ _id: bookingId });
        } catch (error) {
            console.error('Error deleting booking:', error);
            throw new Error('Failed to delete booking'); // Handle the error appropriately
        }
    },
    deleteBookingDetails: async (bookingId) => {
        try {
            // Delete all booking details associated with the booking ID
            await BookingDetail.deleteMany({ bookingId: bookingId });
        } catch (error) {
            console.error('Error deleting booking details:', error);
            throw new Error('Failed to delete booking details'); // Handle the error appropriately
        }
    },

}

module.exports = bookingService;