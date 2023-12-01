const Joi = require('joi')

const registerSchema = Joi.object({
  email: Joi.string().max(100).email().required(),
  password: Joi.string().min(6).max(50).required(),
})
const loginSchema = Joi.object({
  email: Joi.string().max(100).email().required(),
  password: Joi.string().min(6).max(50).required(),
})

module.exports = {
  validateRegister: (data) => registerSchema.validate(data),
  validateLogin: (data) => loginSchema.validate(data),
}
