const userService = require('../services/userService')
const { auth, role } = require('@src/middlewares/authMiddleware')
const { createError } = require('@src/utils/errorHandler')

module.exports = {
  updateUser: async (req, res, next) => {
    try {
      const user = await userService.updateUser(req.params.id, req.body)
      res.status(200).json(user)
    } catch (err) {
      next(err)
    }
  },
}
