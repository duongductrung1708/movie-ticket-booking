const express = require('express');
const { createBooking, getAllBookings, updateBooking, deleteBooking, createBookingData } = require('../controllers/bookingController');
const router = express.Router();

router.post('/', createBooking);
router.post('/create', createBookingData)
router.get('/', getAllBookings);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);

module.exports = router;
