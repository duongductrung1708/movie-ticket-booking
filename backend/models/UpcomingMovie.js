const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const upcomingMovieSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    genre: [
      {
        type: Schema.Types.ObjectId,
        ref: "Genre",
        required: true,
      },
    ],
    language: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    release_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["coming soon", "released", "postponed", "cancelled"],
      default: "coming soon",
    },
    director: String,
    cast: [String],
    synopsis: String,
    trailer_url: String,
    poster_image: String,
  },
  { timestamps: true }
);

const UpcomingMovie = mongoose.model("UpcomingMovie", upcomingMovieSchema);
module.exports = UpcomingMovie;
