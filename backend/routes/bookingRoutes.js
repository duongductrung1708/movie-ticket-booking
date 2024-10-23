const express = require('express');
const { createBooking, getAllBookings, updateBooking, deleteBooking, createBookingData, getBookingByUserId, getBookingById } = require('../controllers/bookingController');
const router = express.Router();

router.post('/', createBooking);
router.post('/create', createBookingData)

//get booking history of each user
router.get("/user/:id", getBookingByUserId)
router.get("/:id",getBookingById)

router.get('/', getAllBookings);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);

module.exports = router;
