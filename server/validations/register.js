const validator = require('validator');
const isEmpty =require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};
    
    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.passwordConfirm = !isEmpty(data.passwordConfirm) ? data.passwordConfirm : '';

    // Name
    if(!validator.isLength(data.name, {min: 2, max: 30})) {
        errors.name = 'Name must be between 2 and 30 characters';
    }
    if(validator.isEmpty(data.name)) {
        errors.name = 'Please fill in your name'
    }
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
    // Password Confirm
    if(!validator.equals(data.password, data.passwordConfirm)) {
        errors.passwordConfirm = 'Password confirm do not match';
    }
    if(validator.isEmpty(data.password)) {
        errors.passwordConfirm = 'Please fill in your password confirmation'
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}