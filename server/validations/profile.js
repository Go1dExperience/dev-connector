const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
    let errors = {};
    console.log(data)
// Validator.isEmpty can only take empty string, not undefined, so we have to change it to '' if it does not exist
    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';

    // Handle
    if(!validator.isLength(data.handle, {min: 2, max: 40})) {
        errors.handle = 'Handle Must be between 2 and 4 characters'
    }
    if(validator.isEmpty(data.handle)) {
        errors.handle = 'Profile handle is required'
    }
    // Status
    if(validator.isEmpty(data.status)) {
        errors.status = 'Profile status field is required'
    }
    // Skills
    if(validator.isEmpty(data.skills)) {
        errors.skills = 'Profile skills field is required'
    }
    // Website and social Media
    if(!isEmpty(data.website)) {
        if(!validator.isURL(data.website)) {
            errors.website = 'Not a valid URL'
        } 
    }
    if(!isEmpty(data.youtube)) {
        if(!validator.isURL(data.youtube)) {
            errors.youtube = 'Not a valid youtube URL'
        } 
    }
    if(!isEmpty(data.facebook)) {
        if(!validator.isURL(data.facebook)) {
            errors.facebook = 'Not a valid facebook URL'
        } 
    }
    if(!isEmpty(data.twitter)) {
        if(!validator.isURL(data.twitter)) {
            errors.twitter = 'Not a valid twitter URL'
        } 
    }
    if(!isEmpty(data.linkedIn)) {
        if(!validator.isURL(data.linkedIn)) {
            errors.linkedIn = 'Not a valid linkedIn URL'
        } 
    }
    if(!isEmpty(data.instagram)) {
        if(!validator.isURL(data.instagram)) {
            errors.instagram = 'Not a valid instagram URL'
        } 
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}