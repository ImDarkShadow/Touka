const fs = require('fs').promises;
const path = require('path');
const catchAsync = require('./catchAsync');

async function getImmediateSubFolders(currentFolderPath) {
  const files = await fs.readdir(currentFolderPath, { withFileTypes: true });

  const folderNames = files.filter((file) => file.isDirectory()).map((file) => file.name);
  console.log(folderNames);
  return folderNames;
}

const getFolders = async (animeFolder) => {
  const folderNames = await getImmediateSubFolders(animeFolder);
  const subFolderDetails = {};

  // eslint-disable-next-line no-restricted-syntax
  await Promise.all(
    folderNames.map(async (folderName) => {
      const subFolderPath = path.join(animeFolder, folderName);
      subFolderDetails[folderName] = await getImmediateSubFolders(subFolderPath);
    }),
  );
  console.log(`subFolder Details${JSON.stringify(subFolderDetails)}`);
  return subFolderDetails;
};
const getEpisodes = async (directoryPath) => {
  const files = await fs.readdir(directoryPath);

  const filePromises = files.map(async (file) => {
    const fullPath = path.join(directoryPath, file);
    const fileStat = await fs.stat(fullPath);
    if (fileStat.isFile() && !file.endsWith('.json')) {
      return file;
    }
    return null;
  });

  const filteredFileNames = await Promise.all(filePromises);
  return filteredFileNames.filter((fileName) => fileName !== null);
};

const getAnimeJson = async (animePath) => {
  console.log(animePath);
  const fullPath = path.join(process.env.ANIME_FOLDER, animePath, 'animeDetails.json');
  console.log(fullPath);
  return fs.readFile(fullPath, 'utf-8');
};

module.exports = { getFolders, getEpisodes, getAnimeJson };
