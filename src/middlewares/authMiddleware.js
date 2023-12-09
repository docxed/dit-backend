const { createError } = require('@src/utils/errorHandler')
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
  if (!roles.includes(req.user.group)) {
    throw createError(403, 'Forbidden', 'ForbiddenError')
  }
  next()
}

module.exports = {
  auth,
  role,
}
