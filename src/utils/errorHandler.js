const createError = (statusCode, message, name = 'Error') => {
  const error = new Error(message)
  error.statusCode = statusCode
  error.name = name
  return error
}

module.exports = {
  createError,
}
