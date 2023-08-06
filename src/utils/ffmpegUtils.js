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
          if (stream.codec_type === 'audio') {
            const audioChannel = stream.tags && stream.tags.language ? stream.tags.language : 'und';

            audioChannels.push(audioChannel);
          } else if (stream.codec_type === 'subtitle') {
            const subtitleChannel = stream.tags && stream.tags.language ? stream.tags.language : 'und';

            subtitleChannels.push(subtitleChannel);
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

module.exports = {
  getAudioSubtitleInfo,
};
