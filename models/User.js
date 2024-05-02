const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstname: String,
    username: String,
    password: String,
    token: String,
    avatar: {type: String, default: '../image/avatar.jpeg'},
});

const User = mongoose.model('users', userSchema);

module.exports = User;