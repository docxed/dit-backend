const { createError } = require('../utils/errorHandler')
const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
  const accessToken = req.headers.authorization?.split(' ')[1]
  if (!accessToken) {
    throw createError(401, 'Unauthorized', 'UnauthorizedError')
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    console.log(err)
    throw createError(401, 'Unauthorized', 'UnauthorizedError')
  }
}

const role = (roles) => (req, res, next) => {
  const { groups } = req.user
  const isAuthorized = groups.some((group) => roles.includes(group))
  if (!isAuthorized) {
    throw createError(403, 'ผู้ใช้งานไม่มีสิทธิ์ใช้งานส่วนนี้', 'ForbiddenError')
  }
  next()
}

module.exports = {
  auth,
  role,
}
