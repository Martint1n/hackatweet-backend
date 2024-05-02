const mongoose = require('mongoose');

const twittSchema = mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    twitt: String,
    hashtag: Array,
    date: String,
});

const Twitt = mongoose.model('twitts', twittSchema);

module.exports = Twitt;