const express = require("express");
const router = express.Router();
const episodeController = require("../controllers/episodeController");
const upload = require("../middlewares/upload");

// Get all episodes by anime
router.get("/anime/:animeId", episodeController.getEpisodesByAnime);

// Get single episode by ID
router.get("/:id", episodeController.getEpisodeById);

// Create episode (with upload)
router.post(
  "/",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  episodeController.createEpisode
);

// Update episode
router.put("/:id", episodeController.updateEpisode);

// Delete episode
router.delete("/:id", episodeController.deleteEpisode);

module.exports = router;
