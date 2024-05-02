const mongoose = require('mongoose');

const twittSchema = mongoose.Schema({
    username: String,
    twitt: String,
    hashtag: Array,
    date: String,
});

const Twitt = mongoose.model('twitts', twittSchema);

module.exports = Twitt;