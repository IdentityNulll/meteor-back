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
    // 👇 Add these two lines here
    const baseURL = `${req.protocol}://${req.get("host")}`;
    const imgURL = req.file
      ? `${baseURL}/uploads/images/${req.file.filename}`
      : null;

    const newAnime = new Anime({
      title: req.body.title,
      description: req.body.description,
      imgURL, // 👈 use this variable here
      genre: req.body.genre,
      status: req.body.status,
    });

    await newAnime.save();
    res.status(201).json(newAnime);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
