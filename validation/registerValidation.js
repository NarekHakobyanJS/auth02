const joi = require('joi')

const registerValidation = joi.object({
    name: joi.string().min(2).required(),
    email: joi.string().email().required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    avatarUrl: joi.string()
})

module.exports = {registerValidation}