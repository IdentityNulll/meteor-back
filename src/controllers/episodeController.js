const { Episode } = require("../models/animeModels");

exports.getEpisodesByAnime = async (req, res) => {
  try {
    const episodes = await Episode.find({ animeId: req.params.animeId }).sort({
      episodeNumber: 1,
    });
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
    const episodeData = {
      animeId: req.body.animeId,
      title: req.body.title,
      episodeNumber: req.body.episodeNumber,
    };

    // ✅ Save video path if uploaded
    if (req.file) {
      episodeData.videoURL = `/uploads/videos/${req.file.filename}`;
    }

    const episode = new Episode(episodeData);
    await episode.save();

    res.status(201).json(episode);
  } catch (error) {
    console.error("Error creating episode:", error);
    res.status(500).json({ error: "Failed to create episode" });
  }
};

exports.updateEpisode = async (req, res) => {
  try {
    const episode = await Episode.findById(req.params.id);
    if (!episode) return res.status(404).json({ message: "Episode not found" });

    // Update text fields
    episode.title = req.body.title || episode.title;
    episode.episodeNumber = req.body.episodeNumber || episode.episodeNumber;

    // Update video if new file uploaded
    if (req.file) {
      episode.videoURL = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }

    await episode.save();
    res.status(200).json(episode);
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
