const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const animeSchema = new mongoose.Schema({
  title: String,
  description: String,
  imgURL: String,
  genre: [String],
  status: { type: String, enum: ["ongoing", "completed"], default: "ongoing" },
});

const episodeSchema = new mongoose.Schema({
  animeId: { type: mongoose.Schema.Types.ObjectId, ref: "Anime" },
  title: String,
  episodeNumber: { type: Number, unique: true },
  videoURL: String,
  thumbnailURL: String,
});

const Anime = mongoose.model("Anime", animeSchema);
const Episode = mongoose.model("Episode", episodeSchema);

module.exports = { Anime, Episode };
