const express = require("express");
const router = express.Router();
const episodeController = require("../controllers/episodeController");
const upload = require("../middlewares/upload");

router.get("/anime/:animeId", episodeController.getEpisodesByAnime);
router.get("/:id", episodeController.getEpisodeById);
router.post("/", upload.single("video"), episodeController.createEpisode);
router.put("/:id", upload.single("video"), episodeController.updateEpisode);
router.delete("/:id", episodeController.deleteEpisode);

module.exports = router;
