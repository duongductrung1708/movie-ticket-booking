const Movie = require("../models/Movie");
const Booking = require("../models/Booking");
const Genre = require("../models/Genre");
const User = require("../models/User");
const Role = require("../models/Role");
const Payment = require("../models/Payment");
const constants = require("../constants/application");

exports.getListTopBookingMoviesByMonth = async (req, res) => {
  try {
    const month = req.query.month;

    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    const currentYear = new Date().getFullYear();

    const startDate = new Date(`${currentYear}-${month}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    const bookings = await Booking.find({
      timestamp: {
        $gte: startDate,
        $lt: endDate,
      },
      status: "confirmed"
    }).populate({
      path: "showtime_id",
      populate: { path: "movie_id", model: "Movie" },
    });

    const movieBookingCount = {};

    bookings.forEach((booking) => {
      const movie = booking.showtime_id.movie_id;
      const movieId = movie._id;

      if (!movieBookingCount[movieId]) {
        movieBookingCount[movieId] = {
          movie: {
            title: movie.title,
            image: movie.image,
          },
          totalBookings: 0,
        };
      }
      movieBookingCount[movieId].totalBookings += 1;
    });

    const topMoviesArray = Object.values(movieBookingCount);
    topMoviesArray.sort((a, b) => b.totalBookings - a.totalBookings);
    const topMovies = topMoviesArray.slice(0, 10);

    res.status(200).json({ topMovies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getTotalValues = async (req, res) => {
  try {
    const month = req.query.month;

    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    const currentYear = new Date().getFullYear();

    const startDate = new Date(`${currentYear}-${month}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    
    const customerRole = await Role.findOne({ name: "customer" }); // Adjust based on your Role model's structure

    if (!customerRole) {
      return res.status(400).json({ message: "Customer role not found" });
    }

    const customers = await User.countDocuments({ role: customerRole._id });

    const bookings = await Booking.countDocuments({
      timestamp: {
        $gte: startDate,
        $lt: endDate,
      },
      status: "confirmed",
    });

    const movies = await Movie.countDocuments({
      status: "Available",
    });

    res.status(200).json({ customers, bookings, movies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getRevenueByYear = async (req, res) => {
  try {
    const year = req.query.year;

    if (!year) {
      return res.status(400).json({ message: "Year is required" });
    }

    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    const revenueByMonth = await Payment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
          status: "success", // Only include successful payments
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" }, // Group by month
          totalRevenue: { $sum: "$amount" }, // Sum the payment amounts
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month in ascending order
      },
    ]);

    // Initialize the result array with 12 months, setting default revenue to 0
    const result = Array.from({ length: 12 }, (_, index) => ({
      name: constants.SHORT_MONTHS[index],
      totalRevenue: 0,
    }));

    // Merge the actual revenue data into the result array
    revenueByMonth.forEach((item) => {
      result[item._id - 1].totalRevenue = item.totalRevenue;
    });

    res.status(200).json({ revenueByMonth: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};



