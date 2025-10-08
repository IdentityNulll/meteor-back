const { Anime, Episode } = require("../models/animeModels");
const fs = require("fs");
const path = require("path");

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
    if (!anime) return res.status(404).json({ message: "Anime not found" });
    res.status(200).json(anime);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createAnime = async (req, res) => {
  try {
    const imgURL = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/images/${req.file.filename}`
      : null;

    const newAnime = new Anime({
      title: req.body.title,
      description: req.body.description,
      imgURL,
      genre: req.body.genre,
      status: req.body.status,
    });

    await newAnime.save();
    res.status(201).json(newAnime);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAnime = async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id);
    if (!anime) return res.status(404).json({ message: "Anime not found" });

    // If a new image is uploaded, delete the old one first
    if (req.file && anime.imgURL) {
      const oldImagePath = path.join(
        __dirname,
        "../../",
        anime.imgURL.split("/uploads/")[1]
      );
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    anime.title = req.body.title || anime.title;
    anime.description = req.body.description || anime.description;
    anime.genre = req.body.genre || anime.genre;
    anime.status = req.body.status || anime.status;

    if (req.file) {
      anime.imgURL = `${req.protocol}://${req.get(
        "host"
      )}/uploads/images/${req.file.filename}`;
    }

    await anime.save();
    res.status(200).json(anime);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteAnime = async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id);
    if (!anime) return res.status(404).json({ message: "Anime not found" });

    // 🧹 Delete anime image
    if (anime.imgURL) {
      const imagePath = path.join(
        __dirname,
        "../../",
        anime.imgURL.split("/uploads/")[1]
      );
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    // 🧹 Delete all related episodes + their videos
    const episodes = await Episode.find({ animeId: anime._id });
    for (const ep of episodes) {
      if (ep.videoURL) {
        const videoPath = path.join(
          __dirname,
          "../../",
          ep.videoURL.split("/uploads/")[1]
        );
        if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
      }
      await ep.deleteOne();
    }

    await anime.deleteOne();

    res
      .status(200)
      .json({ message: "Anime and its files deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
