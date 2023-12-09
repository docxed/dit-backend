const Joi = require('../../../utils/customJoi')

const updateUserSchema = Joi.object({
  prefix: Joi.string().max(50).required(),
  firstname: Joi.thaiOnly().max(100).required(),
  lastname: Joi.thaiOnly().max(100).required(),
  school: Joi.string().max(255).required(),
  gender: Joi.string().max(1).valid('M', 'F').empty(''),
  birthday: Joi.string()
    .max(10)
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .empty(''),
  phone: Joi.string().max(20).empty(''),
  province: Joi.string().max(100).empty(''),
})

module.exports = {
  validateUpdateUser: (data) => updateUserSchema.validate(data),
}
