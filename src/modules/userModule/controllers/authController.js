const authService = require('../services/authService')
const { auth, role } = require(global.SRC + '/middlewares/authMiddleware')
const { createError } = require(global.SRC + '/utils/errorHandler')

module.exports = {
  registerUser: async (req, res, next) => {
    try {
      const user = await authService.registerUser(req.body)
      res.status(201).json(user)
    } catch (err) {
      next(err)
    }
  },
  loginUser: async (req, res, next) => {
    try {
      const user = await authService.loginUser(req.body)
      res.status(200).json(user)
    } catch (err) {
      next(err)
    }
  },
  validateRefreshToken: async (req, res, next) => {
    try {
      const user = await authService.validateRefreshToken(req.body.refresh_token)
      res.status(200).json(user)
    } catch (err) {
      next(err)
    }
  },
  getMe: [
    auth,
    async (req, res, next) => {
      try {
        const user = await authService.getMe(req.user.id)
        if (!user) throw createError(401, 'ไม่พบผู้ใช้งาน', 'UnauthorizedError')
        res.status(200).json(user)
      } catch (err) {
        next(err)
      }
    },
  ],
}
