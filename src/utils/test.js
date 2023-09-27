// const ffmpeg = require('fluent-ffmpeg');
// const util = require('util');
// const { getAudioSubtitleInfo } = require('./ffmpegUtils');
//
// const ffprobe = util.promisify(ffmpeg.ffprobe);
//
// async function convertToHLS(inputFilePath, outputFolderPath, outputPlaylistFilename) {
//   try {
//     const metadata = await ffprobe(inputFilePath);
//     const audioStreams = metadata.streams.filter((stream) => stream.codec_type === 'audio');
//     const subtitleStreams = metadata.streams.filter((stream) => stream.codec_type === 'subtitle');
//     console.log(audioStreams, subtitleStreams);
//     const command = ffmpeg(inputFilePath)
//       .addOption('-hls_time', '10')
//       .addOption('-hls_list_size', '0')
//       .addOption('-hls_segment_filename', `${outputFolderPath}/segment%d.ts`)
//       .output(`${outputFolderPath}/${outputPlaylistFilename}`)
//       .outputOptions('-hls_flags', 'split_by_time');
//
//     audioStreams.forEach((stream) => {
//       command.addOption('-map', `0:${stream.index}`);
//     });
//
//     subtitleStreams.forEach((stream) => {
//       command.addOption('-map', `0:${stream.index}`);
//     });
//
//     await new Promise((resolve, reject) => {
//       command.on('end', resolve).on('error', reject).run();
//     });
//
//     console.log('HLS conversion finished');
//   } catch (error) {
//     console.error('Error while converting to HLS:', error);
//   }
// }

const ffmpeg = require('fluent-ffmpeg');
const { getAudioSubtitleInfo } = require('./ffmpegUtils');

const generateHLS = async (filePath, outputFolderPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .outputOptions(['-c:v copy', '-an', '-sn', '-dn', '-hls_time 5', '-hls_list_size 0'])
      .output(`${outputFolderPath}/output.m3u8`)
      .on('end', () => {
        console.log('HLS generation complete.');
        resolve();
      })
      .on('error', (error) => {
        console.error(`Error: ${error.message}`);
        reject(error);
      })
      .run();
  });
};

const extractAudio = async (filePath, outputFolderPath, audioInfo, index) => {
  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .outputOptions([
        `-map 0:a:${index}`, // Include only the audio stream
        '-c copy', // Copy the audio stream
      ])
      .output(`${outputFolderPath}/Audio ${index + 1} - ${audioInfo.audioChannel}.${audioInfo.codecName}`)
      .on('end', () => {
        console.log('HLS generation complete.');
        resolve();
      })
      .on('error', (error) => {
        console.error(`Error: ${error.message}`);
        reject(error);
      })
      .run();
  });
};

const extractSubtitle = async (filePath, outputFolderPath, subtitleInfo, index) => {
  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .outputOptions([
        `-map 0:s:${index}`, // Include only the audio stream
        '-c copy', // Copy the audio stream
      ])
      .output(`${outputFolderPath}/Sub ${index + 1} - ${subtitleInfo.subtitleChannel}.${subtitleInfo.codecName}`)
      .on('end', () => {
        console.log('HLS generation complete.');
        resolve();
      })
      .on('error', (error) => {
        console.error(`Error: ${error.message}`);
        reject(error);
      })
      .run();
  });
};

// Call the async function
const inputFilePath = '/home/pritam/Documents/Content/Soul Eater/input.mkv';
const outputFolderPath = '/home/pritam/Documents/Temp';
// const outputPlaylistFilename = '/home/pritam/Documents/Temp/output.m3u8';
(async () => {
  const audioSubs = await getAudioSubtitleInfo(inputFilePath);
  await generateHLS(inputFilePath, outputFolderPath);
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < audioSubs.audioChannels.length; i++) {
    extractAudio(inputFilePath, outputFolderPath, audioSubs.audioChannels[i], i);
  }
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < audioSubs.subtitleChannels.length; i++) {
    extractSubtitle(inputFilePath, outputFolderPath, audioSubs.subtitleChannels[i], i);
  }
})();
