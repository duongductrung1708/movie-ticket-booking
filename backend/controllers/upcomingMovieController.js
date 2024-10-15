const UpcomingMovie = require("../models/UpcomingMovie");
const Genre = require("../models/Genre");
const { format, parse } = require("date-fns");

// Get all upcoming movies
exports.getUpcomingMovies = async (req, res) => {
  try {
    const movies = await UpcomingMovie.find().populate("genre", "name");

    const formattedMovies = movies.map((movie) => ({
      ...movie._doc,
      release_date: format(new Date(movie.release_date), "MM/dd/yyyy"),
    }));

    res.status(200).json(formattedMovies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch upcoming movies" });
  }
};

// Get a single upcoming movie by ID
exports.getUpcomingMovieById = async (req, res) => {
  try {
    const movie = await UpcomingMovie.findById(req.params.id).populate(
      "genre",
      "name"
    );
    if (!movie) return res.status(404).json({ msg: "Upcoming movie not found" });

    const formattedMovie = {
      ...movie._doc,
      release_date: format(new Date(movie.release_date), "MM/dd/yyyy"),
    };

    res.status(200).json(formattedMovie);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch upcoming movie" });
  }
};

// Create a new upcoming movie
exports.createUpcomingMovie = async (req, res) => {
  try {
    const {
      title,
      genre,
      language,
      duration,
      release_date,
      status,
      director,
      cast,
      synopsis,
      trailer_url,
      poster_image,
    } = req.body;

    const genreExists = await Genre.findById(genre);
    if (!genreExists) return res.status(404).json({ error: "Genre not found" });

    const newMovie = new UpcomingMovie({
      title,
      genre,
      language,
      duration,
      release_date,
      status,
      director,
      cast,
      synopsis,
      trailer_url,
      poster_image,
    });

    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(500).json({ error: "Failed to create upcoming movie" });
  }
};

// Update an existing upcoming movie
exports.updateUpcomingMovie = async (req, res) => {
  try {
    const {
      title,
      genre,
      language,
      duration,
      release_date,
      status,
      director,
      cast,
      synopsis,
      trailer_url,
      poster_image,
    } = req.body;

    const updateFields = {};

    if (title) updateFields.title = title;
    if (language) updateFields.language = language;
    if (duration) updateFields.duration = duration;
    if (status) updateFields.status = status;
    if (director) updateFields.director = director;
    if (cast) updateFields.cast = cast;
    if (synopsis) updateFields.synopsis = synopsis;
    if (trailer_url) updateFields.trailer_url = trailer_url;
    if (poster_image) updateFields.poster_image = poster_image;
    if (genre) {
      const genreExists = await Genre.findById(genre);
      if (!genreExists) return res.status(404).json({ error: "Genre not found" });
      updateFields.genre = genre;
    }

    const updatedMovie = await UpcomingMovie.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    ).populate("genre", "name");

    if (!updatedMovie) return res.status(404).json({ msg: "Upcoming movie not found" });

    res.status(200).json(updatedMovie);
  } catch (error) {
    res.status(500).json({ error: "Failed to update upcoming movie" });
  }
};

// Delete an upcoming movie
exports.deleteUpcomingMovie = async (req, res) => {
  try {
    const deletedMovie = await UpcomingMovie.findByIdAndDelete(req.params.movieId);
    if (!deletedMovie) return res.status(404).json({ msg: "Upcoming movie not found" });

    res.status(200).json({ msg: "Upcoming movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete upcoming movie" });
  }
};

// Create multiple upcoming movies
exports.createUpcomingMovies = async (req, res) => {
  try {
    const movies = req.body.movies;

    const newMovies = await Promise.all(
      movies.map(async (movieData) => {
        const { genre, release_date } = movieData;

        const parsedReleaseDate = parse(release_date, "MM/dd/yyyy", new Date());

        const genreExists = await Genre.findById(genre);
        if (!genreExists) throw new Error(`Genre not found for genre ID: ${genre}`);

        const newMovie = new UpcomingMovie({ ...movieData, release_date: parsedReleaseDate });
        return newMovie.save();
      })
    );

    res.status(201).json(newMovies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
