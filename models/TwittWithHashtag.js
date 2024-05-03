const mongoose = require('mongoose');

const twittWithHashtagSchema = mongoose.Schema({
    twitt: [Object], //on veut aussi une clé étrangère
    hashtag: String,
});

const TwittWithHashtag = mongoose.model('twittWithHashtags', twittWithHashtagSchema);

module.exports = TwittWithHashtag;

