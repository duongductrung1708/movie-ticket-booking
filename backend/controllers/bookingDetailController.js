const BookingDetail = require('../models/BookingDetail');
const mongoose = require('mongoose');

// Create a new booking detail
exports.createBookingDetail = async (req, res) => {
  try {
    const newBookingDetail = new BookingDetail({
      _id: new mongoose.Types.ObjectId(), // Tạo ID mới cho mỗi booking detail
      ...req.body
    });
    await newBookingDetail.save();
    res.status(201).json(newBookingDetail);
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking detail', error });
  }
};

// Get all booking details
exports.getAllBookingDetails = async (req, res) => {
  try {
    const bookingDetails = await BookingDetail.find()
      .populate('service_id') // Populate service details
      .populate('booking_id'); // Populate booking details
    res.status(200).json(bookingDetails);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking details', error });
  }
};

// Update booking detail by ID
exports.updateBookingDetail = async (req, res) => {
  try {
    const updatedBookingDetail = await BookingDetail.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedBookingDetail);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking detail', error });
  }
};

// Delete booking detail by ID
exports.deleteBookingDetail = async (req, res) => {
  try {
    await BookingDetail.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: 'Booking detail deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking detail', error });
  }
};
