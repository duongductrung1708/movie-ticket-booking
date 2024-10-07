const express = require('express');
const { createBookingDetail, getAllBookingDetails, updateBookingDetail, deleteBookingDetail } = require('../controllers/bookingDetailController');
const router = express.Router();

router.post('/', createBookingDetail);
router.get('/', getAllBookingDetails);
router.put('/:id', updateBookingDetail);
router.delete('/:id', deleteBookingDetail);

module.exports = router;
