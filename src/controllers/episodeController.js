const { Episode } = require("../models/animeModels");

exports.getEpisodesByAnime = async (req, res) => {
  try {
    const episodes = await Episode.find({ animeId: req.params.animeId });
    res.status(200).json(episodes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEpisodeById = async (req, res) => {
  try {
    const episode = await Episode.findById(req.params.id);
    if (!episode) return res.status(404).json({ message: "Episode not found" });
    res.status(200).json(episode);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.createEpisode = async (req, res) => {
  try {
    const newEpisode = new Episode(req.body);
    await newEpisode.save();
    res.status(201).json(newEpisode);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateEpisode = async (req, res) => {
  try {
    const updated = await Episode.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Episode not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteEpisode = async (req, res) => {
  try {
    const deleted = await Episode.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Episode not found" });
    res.status(200).json({ message: "Episode deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
