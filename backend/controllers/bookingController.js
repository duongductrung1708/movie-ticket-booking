const Booking = require('../models/Booking');
const mongoose = require('mongoose');
const { getShowtimeById, updateSeatLayoutShowtime, convertSeatFormat } = require('../services/showtimeService');
const { createBooking, createBookingDetails, deleteBookingDetails } = require('../services/bookingService');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const newBooking = new Booking({
      _id: new mongoose.Types.ObjectId(), // Tạo ID mới cho mỗi booking
      ...req.body
    });
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error });
  }
};

exports.createBookingData = async (req, res) => {
  const preSaveStatus = "available";
  let bookingResponse;
  let bookingDetailsResponse;
  try {
    const { userId, showtimeId, seatIds, serviceIds, status } = req.body;

    const showtime = await getShowtimeById(showtimeId);
    console.log(serviceIds);

    // Update seatLayout status
    await updateSeatLayoutShowtime(showtimeId, seatIds, "reserved");

    // Convert seat format
    const seat = convertSeatFormat(seatIds, showtime.seatLayout);

    // Create a booking
    bookingResponse = await createBooking(userId, showtimeId, showtime.room_id.toString(), seat.toString(), status);

    // Create booking details
    const services = serviceIds.map(item => {
      const [_id, quantity] = item.split('*'); // Split the string into id and quantity
      return { _id, quantity: Number(quantity) }; // Return an object with id and quantity as a number
    });

    bookingDetailsResponse = await createBookingDetails(bookingResponse._id, services);

    return res.json({ booking: bookingResponse, bookingDetails: bookingDetailsResponse });
  } catch (error) {
    console.error("Error occurred: ", error.message);
    const { showtimeId, seatIds } = req.body;
    // Revert seatLayout status back to "available" in case of error
    await updateSeatLayoutShowtime(showtimeId, seatIds, preSaveStatus);

    // If the booking was created, delete it
    if (bookingResponse) {
      await deleteBooking(bookingResponse._id);
    }

    // If booking details were created, delete them (you can fetch them using the booking ID)
    if (bookingDetailsResponse) {
      await deleteBookingDetails(bookingResponse._id);
    }

    // Return error response
    return res.status(500).json({ message: "An error occurred, reverting seat status.", error: error.message });
  }
}

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error });
  }
};

// Update booking by ID
exports.updateBooking = async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking', error });
  }
};

// Delete booking by ID
exports.deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error });
  }
};
