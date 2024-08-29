const mongoose = require("./db");

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  publishedYear: Number,
});

const MovieSchema = new mongoose.Schema({
    plot: String,
    genres: [String],
    runtime: Number,
    cast: [String],
    num_mflix_comments: Number,
    poster: String,
    title: String,
    lastupdated: String,
    languages: [String],
    released: Date,
    directors: [String],
    rated: String,
    awards: {
        wins: Number,
        nominations: Number,
        text: String,
    },
    year: Number,
    imdb: {
        rating: Number,
        votes: Number,
        id: Number,
    },
    countries: [String],
    type: String,
    tomatoes: {
        viewer: {
            rating: Number,
            numReviews: Number,
            meter: Number,
        },
        dvd: Date,
        lastUpdated: Date,
    },
});

const Book = mongoose.model("Book", BookSchema);
const Movie = mongoose.model("Movie", MovieSchema);

module.exports = { Book, Movie };
