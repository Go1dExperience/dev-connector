const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateEducationInput(data) {
    let errors = {};

    data.school = !isEmpty(data.school) ? data.school : '';
    data.degree = !isEmpty(data.degree) ? data.degree : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    // Title
    if(validator.isEmpty(data.school)) {
        errors.school = 'Please fill in your instituition';
    }
    // Company
    if(validator.isEmpty(data.degree)) {
        errors.degree = 'Please fill in the degree you achieved ';
    }
    // From
    if(validator.isEmpty(data.from)) {
        errors.from = 'Please fill in the starting day of your study';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}