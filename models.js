const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


var gameSchema = mongoose.Schema({
    Name: {type: String, required: true},
    Description : { type: String, required: true},
    Genre : [{type : mongoose.Schema.Types.ObjectId, ref: 'genre'}],
    Studio : [{type : mongoose.Schema.Types.ObjectId, ref: 'studio'}],
    Players: {type: Number},
    Img: {type: String}
});

var genreSchema = mongoose.Schema({
    Name: {type: String, required: true},
    Description: {type: String, required: true}
})

var studioSchema = mongoose.Schema({
    Name: {type: String, required: true},
    Description: {type: String, required: true},
    Founded: {type: String},
    StillAlive: {type: Boolean}
})

var userRatingSchema = mongoose.Schema({
    GameID: [{type : mongoose.Schema.Types.ObjectId, ref: 'game'}],
    UserRating: {
        type: Number, 
        min: 0, 
        max: 5, 
        required: true
    },
    UserID: [{type : mongoose.Schema.Types.ObjectId, ref: 'user'}]
})


var userSchema = mongoose.Schema({
    Username : {type: String, required: true},
    Password : {type: String, required: true},
    Email : {type: String, required: true},
    Access : {type: Number},
    Birthday : Date,
    Favorites : [{type : mongoose.Schema.Types.ObjectId, ref: 'game'}]
});

userSchema.statics.hashPassword = function(password) {
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password); 
};

var game = mongoose.model('game', gameSchema);
var user = mongoose.model('user', userSchema);
var genre = mongoose.model('genre', genreSchema);
var studio = mongoose.model('studio', studioSchema);
var rating = mongoose.model('rating', userRatingSchema);

module.exports.game = game;
module.exports.user = user;
module.exports.genre = genre;
module.exports.studio = studio;
module.exports.rating = rating;