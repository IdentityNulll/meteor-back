const express = require('express');
const router = express.Router()
const animeController = require("../controllers/animeController")

router.get("/", animeController.getAllAnime)
router.get("/:id", animeController.getAnimeById)
router.post("/", animeController.createAnime)
router.put("/:id", animeController.updateAnime)
router.delete("/:id", animeController.deleteAnime)

module.exports = router