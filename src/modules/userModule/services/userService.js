const userModel = require('../models/userModel')
const { validateUpdateUser } = require('../validations/userValidation')

module.exports = {
  updateUser: async (id, user) => {
    const { error, value: userData } = validateUpdateUser(user)
    if (error) throw error
    return await userModel.updateUser(id, userData)
  },
}
