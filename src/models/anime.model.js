const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { string } = require('joi');

const animeSchema = new mongoose.Schema({
  slug: { type: String },
  synopsis: { type: String },
  titles: {
    en: { type: String },
    en_jp: { type: String },
    ja_jp: { type: String },
  },
  canonicalTitle: { type: String },
  abbreviatedTitles: [{ type: String }],
  averageRating: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  ageRating: {
    type: String,
    enum: ['G', 'PG', 'R', 'R18'],
  },
  ageRatingGuide: { type: String },
  subtype: {
    type: String,
    enum: ['ONA', 'OVA', 'TV', 'movie', 'music', 'special'],
  },
  status: {
    type: String,
    enum: ['current', 'finished', 'tba', 'unreleased', 'upcoming'],
  },
  posterImage: {
    type: String,
  },
  coverImage: {
    type: String,
  },
  episodeCount: { type: Number },
  episodeLength: { type: Number },
  youtubeVideoId: { type: String },
  nsfw: { type: Boolean },
});

const Anime = mongoose.model('Anime', animeSchema);

module.exports = Anime;
