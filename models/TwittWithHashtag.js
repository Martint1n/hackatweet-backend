const mongoose = require('mongoose');

const twittWithHashtagSchema = mongoose.Schema({
    twitt: [Object],
    hashtag: String,
});

const TwittWithHashtag = mongoose.model('twittWithHashtags', twittWithHashtagSchema);

module.exports = TwittWithHashtag;