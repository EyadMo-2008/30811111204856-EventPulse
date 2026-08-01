const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: error.message || 'Server Error'
  });
};

module.exports = errorHandler;