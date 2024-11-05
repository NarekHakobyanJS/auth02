
const mongoose = require('mongoose');

const PostModel = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    text : {
        type : String,
        required : true
    },
    tags : {
        type : Array,
        default : []
    },
    viewsCount : {
        type : Number,
        default : 0
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users'
    },
    imageUrl : String
})

module.exports = mongoose.model('posts', PostModel)