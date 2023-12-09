const Joi = require('joi')

const thaiOnly = () => {
  return Joi.string().custom((value, helpers) => {
    if (!/^[ก-๙]+$/.test(value)) {
      return helpers.message('กรอกภาษาไทยเท่านั้น')
    }
    return value
  })
}

const password = () => {
  return Joi.string().custom((value, helpers) => {
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)) {
      return helpers.message('รหัสผ่านจะต้องมี 8 ตัวขึ้นไป เป็นตัวอักษรผสมตัวเลข')
    }
    return value
  })
}

Joi.thaiOnly = thaiOnly
Joi.password = password

module.exports = Joi
