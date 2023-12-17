const Joi = require('../../../utils/customJoi')

const createExamsetSchema = Joi.object({
  title: Joi.string().max(255).required(),
  description: Joi.string().required(),
  time: Joi.number().required(),
  max_attempt: Joi.number().required(),
  is_password: Joi.boolean().required(),
  password: Joi.when('is_password', {
    is: true,
    then: Joi.string().max(4).required(),
    otherwise: Joi.string().allow(null).allow(''),
  }),
  is_published: Joi.boolean().required(),
})

module.exports = {
  validateCreateExamset: (data) => createExamsetSchema.validate(data),
}
