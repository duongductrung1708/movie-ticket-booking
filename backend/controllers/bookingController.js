const Booking = require('../models/Booking');
const mongoose = require('mongoose');
const { getShowtimeById, updateSeatLayoutShowtime, convertSeatFormat } = require('../services/showtimeService');
const { createBooking, createBookingDetails, deleteBookingDetails, getBookingByUserId, getBookingDetailByBookingId } = require('../services/bookingService');

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

exports.getBookingByUserId = async (req, res) => {
  const userId = req.params.id;
  try {
    console.log(userId);

    const bookingHistory = await Booking.aggregate([
      {
        $match: { user_id: new mongoose.Types.ObjectId(userId), status: "done" } // Correct instantiation of ObjectId
      },
      {
        $lookup: {
          from: 'showtimes', // The collection name for showtimes
          localField: 'showtime_id',
          foreignField: '_id',
          as: 'showtime'
        }
      },
      { $unwind: "$showtime" }, // Unwind the showtime array
      {
        $lookup: {
          from: 'movies', // The collection name for movies
          localField: 'showtime.movie_id',
          foreignField: '_id',
          as: 'movie'
        }
      },
      { $unwind: "$movie" }, // Unwind the movie array
      {
        $lookup: {
          from: 'rooms', // The collection name for rooms
          localField: 'showtime.room_id',
          foreignField: '_id',
          as: 'room'
        }
      },
      { $unwind: "$room" }, // Unwind the room array
      {
        $lookup: {
          from: 'theaters', // The collection name for theaters
          localField: 'room._id', // Assuming the room is associated with a theater
          foreignField: 'rooms',
          as: 'theater'
        }
      },
      { $unwind: "$theater" }, // Unwind the theater array
      {
        $lookup: {
          from: 'payments', // The collection name for payments
          localField: '_id', // Matching the booking ID to payment's bookingId
          foreignField: 'bookingId',
          as: 'payment'
        }
      },
      { $unwind: "$payment" }, // Unwind the payment array
      {
        $lookup: {
          from: 'bookingdetails',
          localField: '_id',
          foreignField: "booking_id",
          as: 'services'
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: 'services.service_id',
          foreignField: '_id',
          as: 'service'
        }
      },
      {
        $lookup: {
          from: 'paymentmethods', // The collection name for payment methods
          localField: 'payment.paymentMethodId',
          foreignField: '_id',
          as: 'paymentMethod'
        }
      },
      { $unwind: "$paymentMethod" }, // Unwind the payment method array
      {
        $project: {
          theater: "$theater.name",
          address: "$theater.address",
          room: "$room.name",
          showtime: {
            start_time: "$showtime.start_time",
            end_time: "$showtime.end_time",
            date: "$showtime.date"
          },
          movie: {
            _id: '$movie._id',
            title: '$movie.title',
          },
          amount: "$payment.amount",
          paymentMethod: "$paymentMethod.name",
          booking_status: "$status",
          seats: "$seat",
          services: {
            $map: {
              input: "$services", // The array of services from bookingdetails
              as: "serviceItem",
              in: {
                service_id: {
                  $arrayElemAt: ["$service._id", { $indexOfArray: ["$services.service_id", "$$serviceItem.service_id"] }]
                },
                name: {
                  $arrayElemAt: ["$service.name", { $indexOfArray: ["$services.service_id", "$$serviceItem.service_id"] }]
                },
                price: {
                  $arrayElemAt: ["$service.price", { $indexOfArray: ["$services.service_id", "$$serviceItem.service_id"] }]
                },
                quantity: "$$serviceItem.quantity"
              }
            }
          },
          timestamp: "$timestamp"
        }
      }
    ]);
    return res.json(bookingHistory);
  } catch (error) {
    console.error('Error fetching booking history:', error);
    throw error;
  }
}

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
