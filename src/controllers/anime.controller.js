const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { animeService } = require('../services');
const fs = require('fs');

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
const getAnime = catchAsync(async (req, res) => {
  const { animeId } = req.params;
  console.log(animeId);
  const result = await animeService.getAnimeFile(animeId);
  res.send(result);
});
const updateAnime = catchAsync(async (req, res) => {
  const anime = await animeService.updateAnime();
  //console.log(anime);
  res.send(anime);
});

const getEpisode = catchAsync(async (req, res) => {
  const m3u8Content = await fs.readFileSync('/home/pritam/Documents/Temp/output.m3u8', 'utf8');

  res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
  res.send(m3u8Content);
});
// const createAnime = catchAsync(async (req, res) => {
//   const anime = await animeService.createAnime(req.body);
//   res.status(httpStatus.CREATED).send(anime);
// });
module.exports = {
  createAnime,
  getAllAnime,
  updateAnime,
  getEpisode,
  getAnime,
};
