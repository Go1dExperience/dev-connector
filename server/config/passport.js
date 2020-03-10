const {Strategy, ExtractJwt} = require('passport-jwt');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const {JWT_Key}  = require('./keys');

const passportOptions = {};
passportOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
passportOptions.secretOrKey = JWT_Key;

module.exports = passport => {
    passport.use(new Strategy(passportOptions, (jwt_payload, done) => {
        User.findById(jwt_payload.id)
        .then(user => {
            if(!user) {
                return done(null, false)
            }
            return done(null, user)
        })
        .catch(err => res.status(401).json({error: 'Internal error in passport'}))
    }));
}