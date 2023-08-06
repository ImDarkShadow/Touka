const mongoose = require('mongoose');
const validator = require('validator');
const { string } = require('joi');
const { toJSON, paginate } = require('./plugins');
//
const animeSchema = new mongoose.Schema({
  mal_id: {
    type: Number,
    required: true,
    unique: true,
  },
  images: {
    jpg: {
      image_url: String,
    },
    webp: {
      image_url: String,
    },
  },
  titles: Object,

  type: {
    type: String,
    enum: ['TV', 'OVA', 'Movie', 'Special', 'ONA', 'Music'],
    nullable: true,
  },
  source: {
    type: String,
    nullable: true,
  },
  episodes: {
    type: Number,
    nullable: true,
  },
  status: {
    type: String,
    enum: ['Finished Airing', 'Currently Airing', 'Not yet aired'],
    nullable: true,
  },
  airing: Boolean,
  aired: {
    from: String,
    to: String,
  },
  duration: {
    type: String,
    nullable: true,
  },
  rating: {
    type: String,
    enum: [
      'G - All Ages',
      'PG - Children',
      'PG-13 - Teens 13 or older',
      'R - 17+ (violence & profanity)',
      'R+ - Mild Nudity',
      'Rx - Hentai',
    ],
    nullable: true,
  },
  score: {
    type: Number,
    format: 'float',
    nullable: true,
  },
  synopsis: {
    type: String,
    nullable: true,
  },
  season: {
    type: String,
    enum: ['summer', 'winter', 'spring', 'fall', null],
    nullable: true,
  },
  year: {
    type: Number,
    nullable: true,
  },

  studios: [
    {
      mal_id: Number,
      name: String,
    },
  ],
  genres: [
    {
      mal_id: Number,
      name: String,
    },
  ],
  explicit_genres: [String],
  themes: [
    {
      mal_id: Number,
      name: String,
    },
  ],
  demographics: [
    {
      mal_id: Number,
      name: String,
    },
  ],
  relations: [
    {
      relation: String,
      entry: [
        {
          mal_id: Number,
          name: String,
        },
      ],
    },
  ],
  theme: {
    openings: [String],
    endings: [String],
  },
  external: [
    {
      name: String,
      url: String,
    },
  ],
  localPath: String,
});

const Anime = mongoose.model('Anime', animeSchema);

module.exports = Anime;
