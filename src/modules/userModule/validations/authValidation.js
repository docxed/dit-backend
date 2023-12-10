const Joi = require('../../../utils/customJoi')

// Define schemas
const registerSchema = Joi.object({
  email: Joi.string().max(100).email().required(),
  prefix: Joi.string().max(50).required(),
  firstname: Joi.thaiOnly().max(100).required(),
  lastname: Joi.thaiOnly().max(100).required(),
  school: Joi.string().max(255).required(),
  password: Joi.password().max(20).required(),
  confirm_password: Joi.password()
    .max(20)
    .required()
    .valid(Joi.ref('password'))
    .messages({ 'any.only': 'รหัสผ่านไม่ตรงกัน' }),
  gender: Joi.string().max(1).valid('M', 'F').empty(''),
  birthday: Joi.string()
    .max(10)
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .empty(''),
  phone: Joi.string().max(20).empty(''),
  province: Joi.string().max(100).empty(''),
  consent: Joi.boolean().valid(true).required(),
})

const loginSchema = Joi.object({
  email: Joi.string().max(100).email().required(),
  password: Joi.string().min(8).max(20).required(),
})

const changePasswordSchema = Joi.object({
  password: Joi.password().max(20).required(),
  new_password: Joi.password().max(20).required(),
  confirm_new_password: Joi.password()
    .max(20)
    .required()
    .valid(Joi.ref('new_password'))
    .messages({ 'any.only': 'รหัสผ่านไม่ตรงกัน' }),
})

const resetPasswordSchema = Joi.object({
  email: Joi.string().max(100).email().required(),
})

module.exports = {
  validateRegister: (data) => registerSchema.validate(data),
  validateLogin: (data) => loginSchema.validate(data),
  validateChangePassword: (data) => changePasswordSchema.validate(data),
  validateResetPassword: (data) => resetPasswordSchema.validate(data),
}
