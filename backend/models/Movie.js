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
    type: String,
    required: true,
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
      required: true,
    },
  ],
  releaseDate: {
    type: Date,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  ageRating: {
    type: String,
  },
  cast: [String],
  status :{
    type: String,
    default: "Available",
    enum:["Available", "Unavailable"],
  },
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
