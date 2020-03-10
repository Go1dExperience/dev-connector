const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    // Email
    if(!validator.isLength(data.email, {min: 5, max: 30})) {
        errors.email = 'Email must be between 5 and 30 characters';
    }
    if(validator.isEmpty(data.email)) {
        errors.email = 'Please fill in your email';
    }
    if(!validator.isEmail(data.email)) {
        errors.email = 'Email format is incorrect';
    }
    // Password
    if(!validator.isLength(data.password, {min: 5, max: 30})) {
        errors.password = 'Password must be between 5 and 30 characters';
    }
    if(validator.isEmpty(data.password)) {
        errors.password = 'Please fill in your password';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}