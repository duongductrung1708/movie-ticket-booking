const Genre = require("../models/Genre");

// Get all genres
exports.getGenres = async (req, res) => {
  try {
    const genres = await Genre.find();
    res.status(200).json(genres);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch genres" });
  }
};

// Get a single genre by ID
exports.getGenreById = async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).json({ msg: "Genre not found" });
    res.status(200).json(genre);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch genre" });
  }
};

// Create a new genre using req.body
exports.createGenre = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .json({ error: "Name and description are required" });
    }

    const newGenre = new Genre({
      name,
      description,
    });

    const savedGenre = await newGenre.save();
    res.status(201).json(savedGenre);
  } catch (error) {
    res.status(500).json({ error: "Failed to create genre" });
  }
};

// Update an existing genre using req.body
exports.updateGenre = async (req, res) => {
  try {
    const { name, description } = req.body;

    const updateFields = {};

    if (name) {
      updateFields.name = name;
    }

    if (description) {
      updateFields.description = description;
    }

    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .json({
          error:
            "At least one field (name or description) is required to update",
        });
    }

    const updatedGenre = await Genre.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!updatedGenre) return res.status(404).json({ msg: "Genre not found" });
    res.status(200).json(updatedGenre);
  } catch (error) {
    res.status(500).json({ error: "Failed to update genre" });
  }
};

// Delete a genre by ID
exports.deleteGenre = async (req, res) => {
  try {
    const deletedGenre = await Genre.findByIdAndDelete(req.params.id);
    if (!deletedGenre) return res.status(404).json({ msg: "Genre not found" });
    res.status(200).json({ msg: "Genre deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete genre" });
  }
};
