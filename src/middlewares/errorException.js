const errorException = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      name: 'ValidationError',
      status: 'error',
      statusCode: 400,
      message: err.message,
    })
  } else if (err.statusCode) {
    return res.status(err.statusCode).json({
      name: err.name,
      status: 'error',
      statusCode: err.statusCode,
      message: err.message,
    })
  } else {
    console.error(err)
    return res.status(500).json({
      name: 'InternalServerError',
      status: 'error',
      statusCode: 500,
      message: 'Internal Server Error',
    })
  }
}

module.exports = errorException
