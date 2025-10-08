const { Episode } = require("../models/animeModels");
const fs = require("fs");
const path = require("path");

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
    const { animeId, title, episodeNumber } = req.body;

    if (!animeId || !title || !episodeNumber) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const episodeData = { animeId, title, episodeNumber };

    if (req.file) {
      episodeData.videoURL = `${req.protocol}://${req.get(
        "host"
      )}/uploads/videos/${req.file.filename}`;
    }

    const episode = new Episode(episodeData);
    await episode.save();

    res.status(201).json(episode);
  } catch (error) {
    console.error("Error creating episode:", error.message);
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
    const episode = await Episode.findById(req.params.id);
    if (!episode) return res.status(404).json({ message: "Episode not found" });

    // 🧹 Delete video file if exists
    if (episode.videoURL) {
      const videoPath = path.join(
        __dirname,
        "../../",
        episode.videoURL.replace(`${req.protocol}://${req.get("host")}/`, "")
      );
      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    }

    await episode.deleteOne();
    res
      .status(200)
      .json({ message: "Episode and its video deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
