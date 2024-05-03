const mongoose = require('mongoose');

const twittSchema = mongoose.Schema({
    username: String,
    twitt: { type: String, maxLength: 280 },
    hashtag: [String],
    date: String, //A voirr si c'est pas Date
    likedBy: [String],
});

const Twitt = mongoose.model('twitts', twittSchema);

module.exports = Twitt;