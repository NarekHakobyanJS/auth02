
const mongoose = require('mongoose');

const UserModel = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    passwordHash : {
        type : String,
        required : true,
    },
    avatarUrl : String
}, {
    timestamps : true
})

module.exports = mongoose.model('users', UserModel)