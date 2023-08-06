const fs = require('fs').promises;
const path = require('path');
const { getEpisodes } = require('./fileUtils');
const { getAudioSubtitleInfo } = require('./ffmpegUtils');

const createAnimeDetails = async (anime) => {
  const animeFolder = path.join(process.env.ANIME_FOLDER, anime.localPath);
  const animeEpisodes = await getEpisodes(animeFolder);
  const trackInfo = await getAudioSubtitleInfo(path.join(animeFolder, animeEpisodes[0]));
  const animeDetails = {
    mal_id: anime.mal_id,
    episodes: animeEpisodes,
    audios: trackInfo.audioChannels,
    subtitles: trackInfo.subtitleChannels,
    dub: trackInfo.audioChannels.length > 1,
  };
  return fs.writeFile(path.join(animeFolder, 'animeDetails.json'), JSON.stringify(animeDetails));
};
module.exports = createAnimeDetails;
