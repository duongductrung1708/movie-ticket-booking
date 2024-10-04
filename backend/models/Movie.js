const mongoose = require("mongoose");
const { Schema } = mongoose;

const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  trailer: {
    type: String,
  },
  synopsis: {
    type: String,
  },
  language: { 
    type: String 
  },
  director: {
    type: String,
  },
  country: {
    type: String,
  },
  genre: [
    {
      type: Schema.Types.ObjectId,
      ref: "Genre",
    },
  ],
  releaseDate: {
    type: Date,
  },
  duration: {
    type: String,
  },
  ageRating: {
    type: String,
  },
  cast: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;
