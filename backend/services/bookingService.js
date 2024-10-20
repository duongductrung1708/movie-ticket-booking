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
    createBookingDetails: async (bookingId, services) => {
        const savedDetail = []
        console.log(bookingId);
        try {
            services.map(async (service) => {
                // Create a new booking detail object
                const bookingDetail = new BookingDetail({
                    booking_id: bookingId,
                    service_id: service._id, // Assuming service has an id property
                    quantity: service.quantity, // Assuming service has a quantity property
                });
                // Save the booking detail to the database
                savedDetail.push(await bookingDetail.save());
            })
            console.log("Create Booking Details", savedDetail);

            return savedDetail; // Return the saved detail
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