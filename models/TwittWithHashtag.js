const mongoose = require('mongoose');

const twittWithHashtagSchema = mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    twitt: String,
    hashtag: Array,
    date: String,
});

const TwittWithHashtag = mongoose.model('twittWithHashtags', twittWithHashtagSchema);

module.exports = TwittWithHashtag;