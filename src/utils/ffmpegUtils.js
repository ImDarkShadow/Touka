const ffmpeg = require('fluent-ffmpeg');

const getAudioSubtitleInfo = async (videoFilePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoFilePath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }

      const audioChannels = [];
      const subtitleChannels = [];

      if (metadata.streams && Array.isArray(metadata.streams)) {
        metadata.streams.forEach((stream) => {
          //console.log(stream);
          if (stream.codec_type === 'audio') {
            const audioChannel = stream.tags && stream.tags.language ? stream.tags.language : 'und';
            const codecName = stream.codec_name ? stream.codec_name : 'aac';

            audioChannels.push({ audioChannel, codecName });
          } else if (stream.codec_type === 'subtitle') {
            const subtitleChannel = stream.tags && stream.tags.language ? stream.tags.language : 'und';
            const codecName = stream.codec_name ? stream.codec_name : 'srt';
            subtitleChannels.push({ subtitleChannel, codecName });
          }
        });
      }

      const result = {
        audioChannels,
        subtitleChannels,
      };

      return resolve(result);
    });
  });
};

const generateHLS = async (filePath, outputFolderPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .outputOptions(['-c:v copy', '-an', '-sn', '-dn', '-hls_time 5', '-hls_list_size 0'])
      .output(`${outputFolderPath}/output.m3u8`)
      .on('end', () => {
        // console.log('HLS generation complete.');
        resolve();
      })
      .on('error', (error) => {
        // console.error(`Error: ${error.message}`);
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
        // console.log('HLS generation complete.');
        resolve();
      })
      .on('error', (error) => {
        // console.error(`Error: ${error.message}`);
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
        // console.log('HLS generation complete.');
        resolve();
      })
      .on('error', (error) => {
        // console.error(`Error: ${error.message}`);
        reject(error);
      })
      .run();
  });
};
// (async () => {
//   const x = await getAudioSubtitleInfo('/home/pritam/Documents/Content/Soul Eater/input.mkv');
//   console.log(x);
// })();

const processEpisode = async (inputFilePath, outputFolderPath) => {
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
};

module.exports = {
  getAudioSubtitleInfo,
  processEpisode,
};
