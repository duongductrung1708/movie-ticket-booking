const express = require('express')
const { getShowtime, getShowtimeOfTheater, createShowtime, updateShowtime } = require('../controllers/showtimeController')

const showtimeRouter = express.Router()

//get all showtime
showtimeRouter.get('/', getShowtime);

//get showtime of theater
showtimeRouter.get('/:theaterId', getShowtimeOfTheater);

//create showtime
showtimeRouter.post('/', createShowtime)

//update showtime
showtimeRouter.put('/:id',updateShowtime)

module.exports = showtimeRouter