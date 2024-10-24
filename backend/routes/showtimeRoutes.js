const express = require("express");
const {
  getShowtime,
  getShowtimeOfTheater,
  createShowtime,
  updateShowtime,
  getPaginatedShowtime,
  getShowtimesByRoomId,
  deleteShowtime,
  getShowtimeById,
  getShowtimesByMovieId,
  updateSeatLayoutShowtime,
} = require("../controllers/showtimeController");
const showtimeValidation = require("../validation/showtimeValidation");

const showtimeRouter = express.Router();

//get all showtime
showtimeRouter.get("/", getShowtime);

//get paginated showtime
showtimeRouter.get("/paginated", getPaginatedShowtime);

//get showtime by id
showtimeRouter.get("/:id", getShowtimeById);

//get showtime by room id and date
showtimeRouter.get("/room/:id", getShowtimesByRoomId);

//get showtime of theater
showtimeRouter.get("/:theaterId", getShowtimeOfTheater);

//create showtime
showtimeRouter.post("/", showtimeValidation.verifyTime, createShowtime);

//update showtime seatlayout
showtimeRouter.put("/:id/seat-layout",updateSeatLayoutShowtime)

//update showtime
showtimeRouter.put('/:id', showtimeValidation.verifyTime, updateShowtime)

//delete showtime
showtimeRouter.delete("/:id", deleteShowtime);

showtimeRouter.get("/all/:movieId", getShowtimesByMovieId);

module.exports = showtimeRouter;
