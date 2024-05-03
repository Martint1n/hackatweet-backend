const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstname: String,
    username: String,
    password: String,
    token: String,
    twitts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'twitts' }],
    avatar: {type: String, default: '/avatar.jpeg'},
});

const User = mongoose.model('users', userSchema);

module.exports = User;