const express = require('express');
const router = express.Router();
const {
    getUpcomingMovies,
    getUpcomingMovieById,
    createUpcomingMovie,
    updateUpcomingMovie,
    deleteUpcomingMovie,
} = require('../controllers/upcomingMovieController');

// Define routes for upcoming movies
router.get('/', getUpcomingMovies);
router.get('/:movieId', getUpcomingMovieById);
router.post('/', createUpcomingMovie);
router.put('/:movieId', updateUpcomingMovie);
router.delete('/:movieId', deleteUpcomingMovie);

module.exports = router;
