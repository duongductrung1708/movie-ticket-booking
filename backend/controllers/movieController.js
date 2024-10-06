const Movie = require("../models/Movie");
const Genre = require("../models/Genre");

// Get all movies
exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().populate("genre", "name");
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
};

// Get a single movie
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).populate("genre", "name");
    if (!movie) return res.status(404).json({ msg: "Movie not found" });
    res.status(200).json(movie);
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
      image,
      trailer,
      synopsis,
      language,
      director,
      country,
      genre,
      releaseDate,
      duration,
      ageRating,
      cast,
    } = req.body;

    const newMovie = new Movie({
      title,
      rating,
      image,
      trailer,
      synopsis,
      language,
      director,
      country,
      genre,
      releaseDate,
      duration,
      ageRating,
      cast,
    });

    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(500).json({ error: "Failed to create movie" });
  }
};

// Update an existing movie
exports.updateMovie = async (req, res) => {
  try {
    const {
      title,
      rating,
      image,
      trailer,
      synopsis,
      language,
      director,
      country,
      genre,
      releaseDate,
      duration,
      ageRating,
      cast,
    } = req.body;

    const updateFields = {};
    if (title) updateFields.title = title;
    if (rating) updateFields.rating = rating;
    if (image) updateFields.image = image;
    if (trailer) updateFields.trailer = trailer;
    if (synopsis) updateFields.synopsis = synopsis;
    if (language) updateFields.language = language;
    if (director) updateFields.director = director;
    if (country) updateFields.country = country;
    if (genre) updateFields.genre = genre;
    if (releaseDate) updateFields.releaseDate = releaseDate;
    if (duration) updateFields.duration = duration;
    if (ageRating) updateFields.ageRating = ageRating;
    if (cast) updateFields.cast = cast;

    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .json({ error: "At least one field is required to update" });
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );
    if (!updatedMovie) return res.status(404).json({ msg: "Movie not found" });
    res.status(200).json(updatedMovie);
  } catch (error) {
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
