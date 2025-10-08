const express = require("express");
const router = express.Router();
const animeController = require("../controllers/animeController");
const upload = require("../middlewares/upload"); // Multer middleware

// Get all anime
router.get("/", animeController.getAllAnime);

// Get one anime by ID
router.get("/:id", animeController.getAnimeById);

// Create anime with optional image upload
router.post("/", upload.single("img"), animeController.createAnime);

// Update anime with optional image upload
router.put("/:id", upload.single("img"), animeController.updateAnime);

// Delete anime
router.delete("/:id", animeController.deleteAnime);

module.exports = router;
