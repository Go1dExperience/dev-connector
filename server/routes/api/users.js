const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_Key} = require('../../config/keys');
const passport = require('passport');

const User = require('../../models/User');
const validateRegisterInput = require('../../validations/register');
const validateLoginInput = require('../../validations/login');
// GET - /api/users/current
// Des - Test route
// Access - Private 
router.get('/current',passport.authenticate('jwt', {session: false}) ,(req, res) => {
    res.json(req.user);
});
// POST - /api/users/register
// Des - Register User
// Access - Public 
router.post('/register', (req, res) => {
    const {name, email, password, passwordConfirm} = req.body;
    const {errors, isValid} = validateRegisterInput({name, email, password, passwordConfirm});

    if(!isValid) {
        return res.status(400).json({errors})
    }

    User.findOne({email}, (err, user) => {
        if(err) {
            return res.status(422).json({error: 'Internal error with mongodb on line 31'});
        }
        if(user) {
            return res.status(422).json({error: 'This email is already registered'});
        }
        const avatar = gravatar.url(email, {
            s: 200, // Size
            r: 'pg', //Rating
            d: 'mm' // Default
        });
        const newUser = new User({
            name,
            email,
            password,
            avatar
        });
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) {
                    return res.status(422).json({error: 'Internal error while hashing password on line 50'});
                }
                newUser.password = hash;
                newUser.save()
                .then(user => {
                    res.json({user});
                })
                .catch(err => res.status(422).json({error: 'Internal error while saving user on line 57'}));
            });
        });
    });
});
// POST - /api/users/login
// Des - Authenticate User with JWT and session
// Access - Public 
router.post('/login', (req, res) => {
    const {email, password} = req.body;
    const {errors, isValid} = validateLoginInput({email, password});

    if(!isValid) {
        return res.status(400).json(errors)
    } 
    
    User.findOne({email}, (err, user) => {
        if(err) {
            return res.status(422).json({error: 'Internal error while saving finding user on line 75'});
        }
        if(!user) {
            return res.status(404).json({error: 'This user does not exist'});
        }
        bcrypt.compare(password, user.password)
        .then(isMatch => {
            if(!isMatch) {
                return res.status(404).json({error: 'Invalid email or password'});
            }
            const token = jwt.sign({
                id: user.id,
                name: user.name,
                avatar: user.avatar
            }, JWT_Key, {expiresIn: '2 days'});
            return res.status(200).json({token: 'Bearer '+ token})
        })
        .catch(err => res.status(422).json({msg: 'Internal error while comparing password on line 92'}));
    });
});

module.exports = router;