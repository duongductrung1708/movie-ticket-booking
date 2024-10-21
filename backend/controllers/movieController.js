const Movie = require("../models/Movie");
const Genre = require("../models/Genre");
const { format } = require("date-fns");

// Get all movies
exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().populate("genre", "name");

    const formattedMovies = movies.map((movie) => {
      return {
        ...movie._doc,
        releaseDate: format(new Date(movie.releaseDate), "MMMM dd, yyyy"),
      };
    });

    res.status(200).json(formattedMovies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
};

// Get a single movie
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).populate("genre", "name");
    if (!movie) return res.status(404).json({ msg: "Movie not found" });

    const formattedMovie = {
      ...movie._doc,
      releaseDate: format(new Date(movie.releaseDate), "MMMM dd, yyyy"),
    };

    res.status(200).json(formattedMovie);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movie" });
  }
};

// Create a new movie
exports.createMovie = async (req, res) => {
  try {
    const {
      title,
      rating,
      trailer,
      synopsis,
      language,
      director,
      country,
      releaseDate,
      duration,
      ageRating,
      cast,
    } = req.body;

    const image = req.file ? req.file.filename : null; // Lấy file ảnh nếu có

    // Lấy mảng các genres từ body request
    const genres = JSON.parse(req.body.genres)

    if (!genres || genres.length === 0) {
      return res.status(400).json({ error: "Genres are required" });
    }

    // Kiểm tra từng genre có tồn tại hay không
    const foundGenres = await Genre.find({ _id: { $in: genres } });
    if (foundGenres.length !== genres.length) {
      return res.status(404).json({ error: "One or more genres not found" });
    }

    // Tạo phim mới với thông tin và các thể loại đã xác minh
    const newMovie = new Movie({
      title,
      rating,
      image,
      trailer,
      synopsis,
      language,
      director,
      country,
      genre: genres, // Lưu mảng các thể loại
      releaseDate,
      duration,
      ageRating,
      cast,
    });

    // Lưu phim mới vào cơ sở dữ liệu
    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    console.error("Error creating movie:", error);
    res.status(500).json({ error: "Failed to create movie" });
  }
};

// Update an existing movie
exports.updateMovie = async (req, res) => {
  try {
    const {
      title,
      rating,
      trailer,
      synopsis,
      language,
      director,
      country,
      releaseDate,
      duration,
      ageRating,
      status,
    } = req.body;

    // Kiểm tra và giải mã genres và cast nếu chúng tồn tại
    const genres = req.body.genres ? JSON.parse(req.body.genres) : [];
    const castArray = req.body.cast ? JSON.parse(req.body.cast) : [];

    // Kiểm tra nếu có ảnh mới được upload
    const image = req.file ? req.file.filename : req.body.image; // Giữ lại ảnh cũ nếu không có ảnh mới

    // Cập nhật phim
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title,
        rating,
        image,
        trailer,
        synopsis,
        language,
        director,
        country,
        genre: genres, // Mảng thể loại
        releaseDate,
        duration,
        ageRating,
        cast: castArray, // Mảng diễn viên
        status,
      },
      { new: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json(updatedMovie);
  } catch (error) {
    console.error("Error updating movie:", error);
    res.status(500).json({ error: "Failed to update movie" });
  }
};

  

// Delete a movie
exports.deleteMovie = async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie) return res.status(404).json({ msg: "Movie not found" });
    res.status(200).json({ msg: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete movie" });
  }
};

// Create multiple movies
exports.createMovies = async (req, res) => {
  try {
    const movies = req.body.movies;

    const newMovies = await Promise.all(
      movies.map(async (movieData) => {
        const { genre } = movieData;

        const genreExists = await Genre.findById(genre);
        if (!genreExists) {
          throw new Error(`Genre not found for genre ID: ${genre}`);
        }

        const newMovie = new Movie(movieData);
        return newMovie.save();
      })
    );

    res.status(201).json(newMovies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
