const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const animeController = require('../../controllers/anime.controller');
const { animeValidation } = require('../../validations');

const router = express.Router();

router.route('/').get(animeController.getAllAnime).post(animeController.createAnime);
router.route('/updateAnime').get(animeController.updateAnime);
router.route('/getAnime/:animeId').get(animeController.getAnime);
router.route('/getAnime/:animeId/:episodeId').get(animeController.getEpisode);
router.route('/ani').get(animeController.getEpisode);

// router
//   .route('/:animeId')
//   .get(auth(), animeController.getAnime)
//   .put(auth('manageAnime'), animeController.updateAnime)
//   .delete(auth('manageAnime'), animeController.deleteAnime)
//   .patch(auth('manageAnime'), animeController.patchAnime);
module.exports = router;
