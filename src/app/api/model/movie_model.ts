import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema(
  {
    movie_name: {
      type: String,
      unique: true,
      required: true,
    },
    genre: {
      type: String,
      required: true,
      
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    duration: {
      type: Number,
      required: true,
    },
    language: {
      type: String,
      required: true,
      enum: ["Hindi", "English", "Telugu", "Tamil", "Kannada"],
    },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Movie = mongoose.models.Movie || mongoose.model("Movie", MovieSchema);
export default Movie;
