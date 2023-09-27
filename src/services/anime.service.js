const httpStatus = require('http-status');
const { Anime } = require('../models');
const ApiError = require('../utils/ApiError');
const { getFolders, getAnimeJson } = require('../utils/fileUtils');
const { searchAnime, getAnime } = require('../utils/jikanMethods');
const createAnimeDetails = require('../utils/createAnimeDetails');

const getAllAnime = async (filter, options) => {
  const animes = await Anime.find();
  return animes;
};

const getAnimeFile = async (animeId) => {
  const anime = await Anime.findOne({ mal_id: animeId });
  if (anime !== undefined && anime.length !== 0) {
    const localPath = await anime.localPath;
    const animeJson = await getAnimeJson(localPath);
    return animeJson;
  }
  throw new ApiError(httpStatus.NOT_FOUND, 'Anime With the given id not found.');
};
const createAnime = async (animeBody) => {
  await createAnimeDetails(animeBody);
  return Anime.create(animeBody);
};

const checkAnime = async (anime) => {
  console.log(`checking anime: ${anime.mal_id}`);
  const x = await Anime.find({ mal_id: { $eq: anime.mal_id } });
  console.log(typeof x);
  if (!x.length) return true;
  else return false;
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const updateAnime = async () => {
  const allAnimes = await getFolders(process.env.ANIME_FOLDER);
  if (allAnimes === null || allAnimes === undefined) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No anime found');
  }
  const animeNames = Object.keys(allAnimes);

  // Set the time interval between requests based on the rate limits (1000ms for 3 requests)
  const requestInterval = 1000;

  const animeData = [];
  let count = 1;
  for (const animeName of animeNames) {
    if (allAnimes[animeName].length === 0) {
      const animeId = await searchAnime(animeName);

      if (animeId !== null) {
        // Make sure not to exceed the rate limit
        await delay(requestInterval);

        const anime = await getAnime(animeId);
        anime['localPath'] = animeName;
        animeData.push(anime);
      }
    }
  }

  //console.log(`animeData: ${animeData}`);
  //return animeData.filter((anime) => anime !== undefined);
  for (const anime of animeData) {
    if (await checkAnime(anime)) {
      console.log(`creating anime:`);
      await createAnime(anime);
      await createAnimeDetails(anime);
    }
  }
  return animeData;
};

const getEpisode = async (filter, options) => {
  const animes = await Anime.find();
  return animes;
};
module.exports = {
  getAllAnime,
  createAnime,
  updateAnime,
  getAnimeFile,
};
