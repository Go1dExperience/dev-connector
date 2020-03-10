const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
    let errors = {};

    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    // Title
    if(validator.isEmpty(data.title)) {
        errors.title = 'Please fill in your job title';
    }
    // Company
    if(validator.isEmpty(data.company)) {
        errors.company = 'Please fill in the company you worked ';
    }
    // From
    if(validator.isEmpty(data.from)) {
        errors.from = 'Please fill in the starting day of your work';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}