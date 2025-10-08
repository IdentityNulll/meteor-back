const { Anime } = require("../models/animeModels");

// Get all anime
exports.getAllAnime = async (req, res) => {
  try {
    const animes = await Anime.find();
    res.status(200).json(animes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get anime by ID
exports.getAnimeById = async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id);
    if (!anime) return res.status(404).json({ message: "Anime not found" });
    res.status(200).json(anime);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createAnime = async (req, res) => {
  try {
    const animeData = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      genre: req.body.genre,
    };

    // ✅ Save image path if uploaded
    if (req.file) {
      animeData.imgURL = `/uploads/images/${req.file.filename}`;
    }

    const anime = new Anime(animeData);
    await anime.save();

    res.status(201).json(anime);
  } catch (error) {
    console.error("Error creating anime:", error);
    res.status(500).json({ error: "Failed to create anime" });
  }
};

// Update anime
exports.updateAnime = async (req, res) => {
  try {
    const updatedData = { ...req.body };

    if (req.file) {
      updatedData.imgURL = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }

    const updatedAnime = await Anime.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedAnime)
      return res.status(404).json({ message: "Anime not found" });

    res.status(200).json(updatedAnime);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete anime
exports.deleteAnime = async (req, res) => {
  try {
    const deletedAnime = await Anime.findByIdAndDelete(req.params.id);
    if (!deletedAnime)
      return res.status(404).json({ message: "Anime not found" });
    res.status(200).json({ message: "Anime deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
