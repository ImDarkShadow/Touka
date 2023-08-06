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
      const subFolderNames = await getImmediateSubFolders(subFolderPath);
      subFolderDetails[folderName] = subFolderNames;
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

module.exports = { getFolders, getEpisodes };
