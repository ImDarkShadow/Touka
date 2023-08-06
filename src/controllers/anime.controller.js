const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { animeService } = require('../services');

const createAnime = catchAsync(async (req, res) => {
  const anime = await animeService.createAnime(req.body);
  res.status(httpStatus.CREATED).send(anime);
});

const getAllAnime = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['genre', 'year', 'season', 'studio', 'rating', 'type']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await animeService.getAllAnime(filter, options);
  res.send(result);
});

const updateAnime = catchAsync(async (req, res) => {
  const anime = await animeService.updateAnime();
  //console.log(anime);
  res.send(anime);
});
// const createAnime = catchAsync(async (req, res) => {
//   const anime = await animeService.createAnime(req.body);
//   res.status(httpStatus.CREATED).send(anime);
// });
module.exports = {
  createAnime,
  getAllAnime,
  updateAnime,
};
