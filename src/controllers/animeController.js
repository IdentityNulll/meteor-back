const Anime = require("../models/animeModels");

exports.getAllAnime = async (req, res) => {
  try {
    const animes = await Anime.find();
    res.status(200).json(animes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAnimeById = async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id);
    if (!anime) return res.status(404).json({ message: "Anime NOT FOUND" });
    res.status(200).json(anime);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createAnime = async (req, res) => {
  try {
    const newAnime = new Anime(req.body);
    await newAnime.save();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateAnime = async (req, res) => {
  try {
    const updated = await Anime.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Anime not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteAnime = async (req, res) => {
  try {
    const deleted = await Anime.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Anime not found" });
    res.status(200).json({ message: "Anime deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
