const Joi = require('joi');

const createAnime = {
  body: Joi.object().keys({
    mal_id: Joi.number().required().integer().positive(),
    images: Joi.object({
      jpg: Joi.object({
        image_url: Joi.string().uri(),
        small_image_url: Joi.string().uri(),
        large_image_url: Joi.string().uri(),
      }),
      webp: Joi.object({
        image_url: Joi.string().uri(),
        small_image_url: Joi.string().uri(),
        large_image_url: Joi.string().uri(),
      }),
    }),
    titles: Joi.array().items(
      Joi.object({
        type: Joi.string().required(),
        title: Joi.string().required(),
      }),
    ),
    type: Joi.string().valid('TV', 'OVA', 'Movie', 'Special', 'ONA', 'Music').allow(null),
    source: Joi.string().allow(null),
    episodes: Joi.number().integer().positive().allow(null),
    status: Joi.string().valid('Finished Airing', 'Currently Airing', 'Not yet aired').allow(null),
    airing: Joi.boolean().required(),
    aired: Joi.object({
      from: Joi.string().isoDate(),
      to: Joi.string().isoDate().allow(null),
    }),
    duration: Joi.string().allow(null),
    rating: Joi.string()
      .valid(
        'G - All Ages',
        'PG - Children',
        'PG-13 - Teens 13 or older',
        'R - 17+ (violence & profanity)',
        'R+ - Mild Nudity',
        'Rx - Hentai',
      )
      .allow(null),
    score: Joi.number().positive().allow(null),
    scored_by: Joi.number().integer().positive().allow(null),
    rank: Joi.number().integer().positive().allow(null),
    popularity: Joi.number().integer().positive().allow(null),
    members: Joi.number().integer().positive().allow(null),
    favorites: Joi.number().integer().positive().allow(null),
    synopsis: Joi.string().allow(null),
    season: Joi.string().valid('summer', 'winter', 'spring', 'fall').allow(null),
    year: Joi.number().integer().positive().allow(null),
    studios: Joi.array().items(
      Joi.object({
        mal_id: Joi.number().integer().positive().required(),
        type: Joi.string().valid('anime').required(),
        name: Joi.string().required(),
      }),
    ),
    genres: Joi.array().items(
      Joi.object({
        mal_id: Joi.number().integer().positive().required(),
        type: Joi.string().valid('anime').required(),
        name: Joi.string().required(),
      }),
    ),
  }),
};

module.exports = {
  createAnime,
};
