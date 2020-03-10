const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'), passport = require('passport');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const validateProfileInput = require('../../validations/profile');
const validateExperienceInput = require('../../validations/experience');
const validateEducationInput = require('../../validations/education');

// GET - /api/profile
// Des - Test route
// Access - Public 
router.get('/test', (req, res) => {
    res.json({msg: 'Profile Works'})
});
// GET - /api/profile
// Des - Get current user's profile
// Access - private 
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id})
    .then(profile => {
        if(!profile) {
            return res.status(404).json({error: 'No profile for this user found'});
        }
        res.json(profile);
    })
    .catch(error => res.status(400).json(error));
});
// POST - /api/profile
// Des - create current user's profile
// Access - Private 
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {

    const {errors, isValid} = validateProfileInput(req.body);
    if(!isValid) {
        return res.status(400).json(errors);
    }

    const {handle, company, website, location, status, skills, bio, githubusername, youtube, facebook, twitter, linkedIn, instagram} = req.body;
    const profileFields = {};

    if(handle) profileFields.handle = handle;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(status) profileFields.status = status;
    if(bio) profileFields.bio = bio;
    if(githubusername) profileFields.githubusername = githubusername;
    // Turning skills from comma-seperated values into an array
    if(typeof skills !== 'undefined') {
        profileFields.skills = skills.split(',');
    }
    // Social
    profileFields.social = {};
    if(youtube) profileFields.social.youtube = youtube;
    if(facebook) profileFields.social.facebook = facebook;
    if(twitter) profileFields.social.twitter = twitter;
    if(linkedIn) profileFields.social.linkedIn = linkedIn;
    if(instagram) profileFields.social.instagram = instagram;
    profileFields.user = req.user;

    Profile.findOne({user: req.user.id})
    .populate('user', ['name', 'email', 'avatar'])
    .then(profile => {
        // If profile exists, update profile
        if(profile) {
            Profile.findByIdAndUpdate(profile._id, {$set: profileFields}, {new: true})
            .populate('user')
            .then(newProfile => res.status(200).json(newProfile))
            .catch(err => console.log(err));
        } else {
            // Profile doesn't exist, so create new

            // Check if handle exists
            Profile.findOne({handle: profileFields.handle})
            .then(profile => {
                if(profile) {
                    return res.status(400).json({error: 'This handle has already been in use'})
                }
                // Save profile
                new Profile(profileFields).save()
                .then(profile => res.status(200).json(profile))
            })
        }
    })
    .catch(err => console.log(err))
});
// GET - /api/profile/all
// Des - Get All Profile
// Access - Public 
router.get('/all', (req, res) => {
    Profile.find({})
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
        if(!profiles) {
            return res.status(404).json({error: 'No profiles found'})
        }
        res.json(profiles);
    })
    .catch(err => res.json({error: 'Internal Error searching by handle on line 100'}))
});
// GET - /api/profile/handle/:handle
// Des - Get Profile by handle
// Access - Public 
router.get('/handle/:handle', (req, res) => {
    Profile.findOne({handle: req.params.handle})
    .populate('user', ['name', 'avatar'])
    .then(profile => {
        if(!profile) {
            return res.status(404).json({error: 'No profile found for this user'})
        }
        res.json(profile);
    })
    .catch(err => res.json({error: 'Internal Error searching by handle on line 114'}))
});
// GET - /api/profile/user/:user
// Des - Get Profile by user
// Access - Public 
router.get('/user/:user_id', (req, res) => {
    Profile.findOne({user: req.params.user_id})
    .populate('user', ['name', 'avatar'])
    .then(profile => {
        if(!profile) {
            return res.status(404).json({error: 'No profile found for this user'})
        }
        res.json(profile);
    })
    .catch(err => res.json({error: 'Internal Error searching by user on line 128'}))
});
// POST - /api/profile/experience
// Des - create current user's experience
// Access - Private 
router.post('/experience', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {title, company, location, from, to, current, description} = req.body;  
    
    const {errors, isValid} = validateExperienceInput(req.body);
    if(!isValid) {
        return res.status(400).json(errors);
    }

    Profile.findOne({user: req.user.id})
    .populate('user', ['name', 'email', 'avatar'])
    .then(profile => {
        const newExperience = {title, company, location, from, to, current, description};
        // Add to experience array
        profile.experience.unshift(newExperience);
        profile.save()
        .then(newProfile => res.status(200).json({newProfile}));
    })
    .catch(err => res.status(422).json({error: 'Internal error on line 144'}));
});
// POST - /api/profile/experience
// Des - create current user's experience
// Access - Private 
router.post('/education', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {school, degree, fieldofstudy, from, to, current, description} = req.body;  

    const {errors, isValid} = validateEducationInput(req.body);
    if(!isValid) {
        return res.status(400).json(errors);
    }

    Profile.findOne({user: req.user.id})
    .populate('user', ['name', 'email', 'avatar'])
    .then(profile => {
        const newExperience = {school, degree, fieldofstudy, from, to, current, description};
        // Add to experience array
        profile.education.unshift(newExperience);
        profile.save()
        .then(newProfile => res.status(200).json({newProfile}));
    })
    .catch(err => res.status(422).json({error: 'Internal error on line 144'}));
});
// DELETE - /api/profile/experience/:exp_id
// Des - Delete experience from profile
// Access - Private 
router.delete('/experience/:exp_id', 
            passport.authenticate('jwt', {session: false}), 
            (req, res) => {

    Profile.findOne({user: req.user.id})
    .then(profile => {
        const removeIndex = profile.experience
        .map(eachExperience => eachExperience.id)
        .indexOf(req.params.exp_id);
        if(removeIndex === -1) {
            return res.status(404).json({error: 'No experience found for this query'});
        }
        profile.experience.splice(removeIndex, 1);
        profile.save()
        .then(newProfile => res.status(200).json({newProfile}))
        .catch(err => res.status(400).json({error: 'Internal error deleting exp'}))

    })
    .catch(err => res.status(422).json({error: 'Internal error on line 196'}));
});
// DELETE - /api/profile/education/:edu_id
// Des - Delete education from profile
// Access - Private 
router.delete('/education/:edu_id', 
            passport.authenticate('jwt', {session: false}), 
            (req, res) => {

    Profile.findOne({user: req.user.id})
    .then(profile => {
        const removeIndex = profile.education
        .map(eachEducation => eachEducation.id)
        .indexOf(req.params.edu_id);
        if(removeIndex === -1) {
            return res.status(404).json({error: 'No education found for this query'});
        }
        profile.education.splice(removeIndex, 1);
        profile.save()
        .then(newProfile => res.status(200).json({newProfile}))
        .catch(err => res.status(400).json({error: 'Internal error deleting education'}))

    })
    .catch(err => res.status(422).json({error: 'Internal error on line 218'}));
});
// DELETE - /api/profile
// Des - Delete user and profile
// Access - Private 
router.delete('/', 
            passport.authenticate('jwt', {session: false}), 
            (req, res) => {

    Profile.findOneAndRemove({user: req.user.id})
    .then(() => {
        User.findByIdAndDelete(req.user.id)
        .then(() => res.status(200).json('Success'))
    })
    .catch(err => res.status(422).json({error: 'Internal Error deleting Profile'}))
    
});
module.exports = router;