const catchAsync = require('./catchAsync');
const axios = require('axios');
const https = require('https');

// Create an instance of https.Agent with family set to 4 (IPv4)
const agent = new https.Agent({ family: 4 });

// Set the agent as a default option for all Axios requests
axios.defaults.httpsAgent = agent;

const searchAnime = async (animeName) => {
  //const got = await import('got');
  console.log(`requesting all animes`);
  const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${animeName}&limit=1`);
  //console.log(response.data.data);
  if (response.data.data.length === 0) {
    return null;
  } else {
    return response.data.data[0].mal_id;
  }
};

const getAnime = async (animeId) => {
  const response = await axios.get(`https://api.jikan.moe/v4/anime/${animeId}/full`);
  return response.data.data;
  //return 'uhkilj';
};
module.exports = {
  searchAnime,
  getAnime,
};
